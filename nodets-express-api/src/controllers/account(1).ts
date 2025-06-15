/**
 * Express router providing user account related routes
*/
import express from 'express';
import { Rbac } from '../helpers/rbac';
import utils from '../helpers/utils';
import DB from '../datasource';
import { HttpRequest, HttpResponse } from '../helpers/http';
import { body }  from 'express-validator';
import uploader from '../helpers/uploader';
import validateFormData from '../helpers/validate_form';
const Users = DB.Users;
const router = express.Router();


/**
 * Route to view Users record
 * @route {GET} /users/view/{recid}
 */
router.get(['/', '/index'], async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.user.userid;
		let query = Users.getQuery();
		query.where("userid=:recid", { recid });
		let selectFields = Users.accountviewFields();
		//page export command
		query.select(selectFields);
		let record = await query.getRawOne();
		if(!record){
			return res.recordNotFound();
		}
		return res.send(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Users record for edit
 * @route {GET} /users/edit/{recid}
 */
router.get(['/edit'], async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.user.userid;
		let query = Users.getQuery();
		const editFields = Users.accounteditFields(); // get fields to edit
		query.where("userid=:recid", { recid });
		query.select(editFields);
		let record = await query.getRawOne();
		if(!record){
			return res.recordNotFound();
		}
		return res.send(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to update  Users record
 * @route {POST} /users/edit/{recid}
 */
router.post(['/edit'] , 
	[
		body('username').optional({nullable: true, checkFalsy: true}),
		body('usertele').optional({nullable: true, checkFalsy: true}),
		body('userphoto').optional({nullable: true, checkFalsy: true}),
		body('user_role_id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.user.userid;
		
		const editFields = Users.accounteditFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.userphoto !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.userphoto, "userphoto");
			modeldata.userphoto = fileInfo.filepath;
		}
		const query = Users.getQuery();
		query.where("userid=:recid", { recid });
		query.select(editFields);
		const record = await query.getRawOne();
		if(!record){
			return res.recordNotFound();
		}
		Object.assign(record, modeldata); // update record with form input
		await query.update().set(modeldata).execute();
		return res.send(record);
	}
	catch(err){
		return res.serverError(err);
	}
});
router.get('/currentuserdata', async function (req:HttpRequest, res:HttpResponse)
{
	let user = req.user;
	let userRole = user.user_role_id;
	let rbac = new Rbac(userRole);
	let userPages = await rbac.getUserPages();
	let userRoleNames = await rbac.getRoleNames();
	let data = {
		user: user,
		pages: userPages,
		roles: userRoleNames
	}
    return res.send(data);
});


/**
 * Route to change user password
 * @route {POST} /account
 */
router.post('/changepassword' , 
	[
		body('oldpassword').not().isEmpty(),
		body('newpassword').not().isEmpty(),
		body('confirmpassword').not().isEmpty().custom((value, {req}) => (value === req.body.newpassword))
	], validateFormData, async function (req:HttpRequest, res:HttpResponse) {
	try{
		const oldPassword = req.body.oldpassword;
		const newPassword = req.body.newpassword;
		const userid = req.user.userid;
		const user = await Users.getQuery().where("userid=:userid", { userid }).getOne();
		const currentPasswordHash = user.userpwd;
		if(!utils.passwordVerify(oldPassword, currentPasswordHash)){
			return res.badRequest("Current password is incorrect");
		}
		const modeldata = {
			userpwd: utils.passwordHash(newPassword)
		}
		Object.assign(user, modeldata);
		await Users.save(user);
		return res.send("Password change completed");
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
