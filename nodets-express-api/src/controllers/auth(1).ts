/** 
 * Express router providing user auth routes
*/
import express from 'express';
import utils from '../helpers/utils';
import DB from '../datasource';
import { HttpRequest, HttpResponse } from '../helpers/http';
import config from '../config';
import { body }  from 'express-validator';
import bcrypt from 'bcryptjs';
import ejs from 'ejs';
import uploader from '../helpers/uploader';
import jwt from 'jsonwebtoken';
import validateFormData from '../helpers/validate_form';
import sendMail from '../helpers/mailer';
const Users = DB.Users;
const router = express.Router();


/**
 * Route to login user using credential
 * @route {POST} /auth/login
 */
router.post('/login', [
		body('username').trim().not().isEmpty(),
		body('password').not().isEmpty(),
	], validateFormData, async (req:HttpRequest, res:HttpResponse) => {
	try{
		let { username, password } = req.body;
		let user = await Users.findOne({where: [{useremail: username }, {username: username}]});
		if(!user){
			return res.unauthorized("Username or password not correct");
		}
		if(!utils.passwordVerify(password, user.userpwd)){
			return res.unauthorized("Username or password not correct");
		}
		let loginData = await getUserLoginData(user);
		return res.send(loginData);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to register new user
 * @route {POST} /auth/register
 */
router.post('/register', 
	[
		body('username').not().isEmpty(),
		body('userpwd').not().isEmpty(),
		body('confirm_password', 'Passwords do not match').custom((value, {req}) => (value === req.body.userpwd)),
		body('useremail').not().isEmpty().isEmail(),
		body('usertele').optional({nullable: true, checkFalsy: true}),
		body('userphoto').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req:HttpRequest, res:HttpResponse) {
	try{
		let modeldata = req.getValidFormData();
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.userphoto !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.userphoto, "userphoto");
			modeldata.userphoto = fileInfo.filepath;
		}
		
		//hash password before save
		modeldata.userpwd = utils.passwordHash(modeldata.userpwd);
		
		// set default role for user
		const roleId =  await DB.Roles.findValue('role_id', {role_name: 'Admin'});
		modeldata['user_role_id'] = roleId;
		
		//check if username already exists
		let usernameExists = await Users.getQuery().where({'username': modeldata.username}).exists();
		if(usernameExists){
			return res.badRequest(`${modeldata.username} already exist.`);
		}
		
		//check if useremail already exists
		let useremailExists = await Users.getQuery().where({'useremail': modeldata.useremail}).exists();
		if(useremailExists){
			return res.badRequest(`${modeldata.useremail} already exist.`);
		}
		const record = await Users.save(modeldata);
		
		//get user record
		const user = await Users.findOne({
			where: {'userid': record.userid}
		});
		
		let loginData = await getUserLoginData(user);
		return res.send(loginData);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to send password reset link to user email
 * @route {POST} /auth/forgotpassword
 */
router.post('/forgotpassword', [
		body('email').not().isEmpty().isEmail(),
	], validateFormData, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const modeldata = req.getValidFormData();
		let email = modeldata.email;
		let user = await Users.findOne({where: { 'useremail': email} });
		if(!user){
			return res.recordNotFound("Email not registered");
		}
		await sendPasswordResetLink(user);
		
		return res.send("We have emailed your password reset link!");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to reset user password
 * @route {POST} /auth/resetpassword
 */
router.post('/resetpassword', [
		body('password').not().isEmpty().custom((val, { req }) => {
			if (val !== req.body.confirm_password) {
				throw new Error("Passwords confirmation does not match");
			} else {
				return val;
			}
        }),
	], validateFormData,  async (req, res) => {
	try{
		const token = req.body.token;
		const userid = getUserIDFromJwt(token);  //get user id from token payload
		const password = req.body.password;
		const record = await Users.getQuery().where("userid=:userid", { userid }).getOne();
		if(!record){
			return res.recordNotFound("User not found");
		}
		const newPassword = bcrypt.hashSync(password, 10);
		const modeldata = {userpwd: newPassword}
		Object.assign(record, modeldata);
		const user = await Users.save(record);
		
		return res.send("Password changed");
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Send password reset link to user email 
*/
async function sendPasswordResetLink(user){
	let token = generateUserToken(user);
	let resetlink = `${config.app.frontendUrl}/#/index/resetpassword?token=${token}`;
	let username = user.username;
	let email = user.useremail;
	let mailtitle = 'Password Reset';
	
	let viewData = { username, email, resetlink, config };
	let mailbody = await ejs.renderFile("src/views/pages/index/password_reset_email_template.ejs", viewData);
	
	let mailResult = await sendMail(email, mailtitle, mailbody);
	if(!mailResult.messageId){
		throw new Error(mailResult.response);
	}
	return true;
}


/**
 * Return user login data
 * @param {object} user - current user
 */
async function getUserLoginData(user){
	const expiresIn = config.auth.jwtDuration + 'm' //in minutes;
	const userid = user.userid;
	const token = jwt.sign({ sub: userid }, config.auth.apiTokenSecret, { expiresIn });
	return { token }; //return user object and token
}


/**
 * Generate jwt token
 * @param {object} user - current user
 */
function generateUserToken(user){
	const expiresIn = '10m' //in minutes;
	const userid = user.userid;
	const token = jwt.sign({ sub: userid }, config.auth.userTokenSecret, { expiresIn });
	return token;
}


/**
 * Get userid from jwt token
 * @param {string} token
 */
function getUserIDFromJwt(token){
	try {
		let decoded = jwt.verify(token, config.auth.userTokenSecret);
		return decoded.sub
	}
	catch (err) {
		throw new Error(err);
	}
}
export default router;
