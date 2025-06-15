/**
 * Express router providing  related routes
*/
import express from 'express';
import utils from '../helpers/utils';
import DB from '../datasource';
import * as csv from '@fast-csv/parse';
import { HttpRequest, HttpResponse } from '../helpers/http';
import { body }  from 'express-validator';
import uploader from '../helpers/uploader';
import { fileUploadMiddleware } from '../helpers/upload_middleware';
import validateFormData from '../helpers/validate_form';
import { Not, In } from 'typeorm';
import UsersListExport from '../exports/UsersList';
const Users = DB.Users;
const router = express.Router();




/**
 * Route to list users records
 * @route {GET} /users/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = Users.getQuery();
		
		const fieldName = req.params.fieldname;
		const fieldValue = req.params.fieldvalue;
		const search = req.query.search;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 5;
		
		if (fieldName){
			 //filter by a single column values
			query.where(`${fieldName}=:fieldValue`, {fieldValue});
		}
		
		
		if(search){
			let searchFields = Users.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		
		const selectFields = Users.listFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('userid', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		if(req.query.export){
			const exportFields = Users.exportListFields(); // get export fields
			query.select(exportFields);
			let records = await query.getRawMany();
			return UsersListExport(records, req, res);
		}
		
		//return records and pager info
		const pageData = await Users.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});


/**
 * Route to import Users records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @route {GET} /users/importdata
 */
router.post('/importdata', fileUploadMiddleware('importdata'), async (req:HttpRequest, res:HttpResponse) => {
	const uploadedFiles = req.files as any[];
	if(uploadedFiles){
		const uploadedPaths = uploadedFiles.map(file => file.path);
		uploadedPaths.forEach(function (fpath){
			let records = [];
			csv.parseFile(fpath, { headers: true, ignoreEmpty: true }).on("data", (data) => {
				if(data){
					const modeldata = {
							username: data['username'],
							userpwd: data['userpwd'],
							useremail: data['useremail'],
							usertele: data['usertele'],
							userphoto: data['userphoto'],
							user_role_id: data['user_role_id']
					}
					records.push(modeldata);
				}
			}).on("end", async() => {
				try{
					const query = Users.getQuery();
					const result = await query.insert().values(records).execute();
					return res.send(`${result.raw.affectedRows} Records Imported`);
				}
				catch(err){
					return res.serverError(err);
				}
			});
		});
	}
	else{
		return res.badRequest("Error uploading file")
	}
});


/**
 * Route to view Users record
 * @route {GET} /users/view/{recid}
 */
router.get('/view/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Users.getQuery();
		query.where("userid=:recid", { recid });
		let selectFields = Users.viewFields();
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
 * Route to insert Users record
 * @route {POST} /users/add
 */
router.post('/add/' , 
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
		
		//save Users record
		let record = await Users.save(modeldata);
		
		return res.send(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Users record for edit
 * @route {GET} /users/edit/{recid}
 */
router.get('/edit/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Users.getQuery();
		const editFields = Users.editFields(); // get fields to edit
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
router.post('/edit/:recid' , 
	[
		body('username').optional({nullable: true}).not().isEmpty(),
		body('usertele').optional({nullable: true, checkFalsy: true}),
		body('userphoto').optional({nullable: true, checkFalsy: true}),
		body('user_role_id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.params.recid;
		
		const editFields = Users.editFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.userphoto !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.userphoto, "userphoto");
			modeldata.userphoto = fileInfo.filepath;
		}
		
		//check if username already exists
		let usernameExists = await Users.getQuery().where({
			'username': modeldata.username, 
			'userid': Not(recid)
		}).exists();
		if(usernameExists){
			return res.badRequest(`${modeldata.username} already exist.`);
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


/**
 * Route to delete Users record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /users/delete/{recid}
 */
router.get('/delete/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = Users.getQuery();
		query.where({'userid': In(recid)});
		 
		const records = await query.getMany();
		if(!records){
			return res.recordNotFound();
		}
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		
		const result = await query.delete().execute();
		
		return res.send(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
