/**
 * Express router providing  related routes
*/
import express from 'express';
import DB from '../datasource';
import * as csv from '@fast-csv/parse';
import { HttpRequest, HttpResponse } from '../helpers/http';
import { body }  from 'express-validator';
import uploader from '../helpers/uploader';
import { fileUploadMiddleware } from '../helpers/upload_middleware';
import validateFormData from '../helpers/validate_form';
import { In } from 'typeorm';
import CertificatesListExport from '../exports/CertificatesList';
const Certificates = DB.Certificates;
const router = express.Router();




/**
 * Route to list certificates records
 * @route {GET} /certificates/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = Certificates.getQuery();
		
		const fieldName = req.params.fieldname;
		const fieldValue = req.params.fieldvalue;
		const search = req.query.search;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 5;
		
		if (fieldName){
			 //filter by a single column values
			query.where(`${fieldName}=:fieldValue`, {fieldValue});
		}
		
		if(req.query.certificate_type){
			let paramValue = req.query.certificate_type;
			query.andWhere("certificates.certificate_type=:paramValue", { paramValue });
		}
		
		if(search){
			let searchFields = Certificates.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		const allowedRoles = ["admin"];
		const userRole = req.user.roleName;
		if(!allowedRoles.includes(userRole)){
			query.andWhere('student_id=:userid', { userid: req.user.userid });
		}
		
		// join Users table 
		query.leftJoin("Users", "users", "certificates.student_id = users.userid");
		
		const selectFields = Certificates.listFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('certificate_id', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		if(req.query.export){
			const exportFields = Certificates.exportListFields(); // get export fields
			query.select(exportFields);
			let records = await query.getRawMany();
			return CertificatesListExport(records, req, res);
		}
		
		//return records and pager info
		const pageData = await Certificates.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});


/**
 * Route to import Certificates records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @route {GET} /certificates/importdata
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
							certificate_type: data['certificate_type'],
							certificate_name: data['certificate_name'],
							student_id: data['student_id'],
							award_date: data['award_date'],
							blocknum: data['blocknum'],
							tx_hash: data['tx_hash'],
							certificate_photo: data['certificate_photo'],
							timestamp: data['timestamp']
					}
					records.push(modeldata);
				}
			}).on("end", async() => {
				try{
					const query = Certificates.getQuery();
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
 * Route to view Certificates record
 * @route {GET} /certificates/view/{recid}
 */
router.get('/view/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Certificates.getQuery();
		query.where("certificates.certificate_id=:recid", { recid });
		const allowedRoles = ["admin"];
		const userRole = req.user.roleName;
		if(!allowedRoles.includes(userRole)){
			query.andWhere('student_id=:userid', { userid: req.user.userid });
		}
		let selectFields = Certificates.viewFields();
		
		// join Users table 
		query.leftJoin("Users", "users", "certificates.student_id = users.userid");
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
 * Route to insert Certificates record
 * @route {POST} /certificates/add
 */
router.post('/add/' , 
	[
		body('certificate_type').optional({nullable: true, checkFalsy: true}),
		body('certificate_name').optional({nullable: true, checkFalsy: true}),
		body('certificate_photo').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req:HttpRequest, res:HttpResponse) {
	try{
		let modeldata = req.getValidFormData();
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.certificate_photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.certificate_photo, "certificate_photo");
			modeldata.certificate_photo = fileInfo.filepath;
		}
		
		//save Certificates record
		let record = await Certificates.save(modeldata);
		
		return res.send(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Certificates record for edit
 * @route {GET} /certificates/edit/{recid}
 */
router.get('/edit/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Certificates.getQuery();
		const editFields = Certificates.editFields(); // get fields to edit
		query.where("certificate_id=:recid", { recid });
		const allowedRoles = ["admin"];
		const userRole = req.user.roleName;
		if(!allowedRoles.includes(userRole)){
			query.andWhere('student_id=:userid', { userid: req.user.userid });
		}
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
 * Route to update  Certificates record
 * @route {POST} /certificates/edit/{recid}
 */
router.post('/edit/:recid' , 
	[
		body('certificate_type').optional({nullable: true, checkFalsy: true}),
		body('certificate_name').optional({nullable: true, checkFalsy: true}),
		body('certificate_photo').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.params.recid;
		
		const editFields = Certificates.editFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.certificate_photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.certificate_photo, "certificate_photo");
			modeldata.certificate_photo = fileInfo.filepath;
		}
		const query = Certificates.getQuery();
		query.where("certificate_id=:recid", { recid });
		const allowedRoles = ["admin"];
		const userRole = req.user.roleName;
		if(!allowedRoles.includes(userRole)){
			query.andWhere('student_id=:userid', { userid: req.user.userid });
		}
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
 * Route to delete Certificates record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /certificates/delete/{recid}
 */
router.get('/delete/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = Certificates.getQuery();
		query.where({'certificate_id': In(recid)});
		const allowedRoles = ["admin"];
		const userRole = req.user.roleName;
		if(!allowedRoles.includes(userRole)){
			query.andWhere('student_id=:userid', { userid: req.user.userid });
		}
		 
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
