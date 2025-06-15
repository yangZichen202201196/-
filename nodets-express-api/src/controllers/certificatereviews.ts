/**
 * Express router providing  related routes
*/
import express from 'express';
import DB from '../datasource';
import { HttpRequest, HttpResponse } from '../helpers/http';
import { body }  from 'express-validator';
import uploader from '../helpers/uploader';
import validateFormData from '../helpers/validate_form';
import { In } from 'typeorm';
const CertificateReviews = DB.CertificateReviews;
const router = express.Router();




/**
 * Route to list certificatereviews records
 * @route {GET} /certificatereviews/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = CertificateReviews.getQuery();
		
		const fieldName = req.params.fieldname;
		const fieldValue = req.params.fieldvalue;
		const search = req.query.search;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		
		if (fieldName){
			 //filter by a single column values
			query.where(`${fieldName}=:fieldValue`, {fieldValue});
		}
		
		
		if(search){
			let searchFields = CertificateReviews.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		const allowedRoles = ["admin"];
		const userRole = req.user.roleName;
		if(!allowedRoles.includes(userRole)){
			query.andWhere('student_id=:userid', { userid: req.user.userid });
		}
		
		const selectFields = CertificateReviews.listFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('review_id', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		
		//return records and pager info
		const pageData = await CertificateReviews.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});


/**
 * Route to view CertificateReviews record
 * @route {GET} /certificatereviews/view/{recid}
 */
router.get('/view/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = CertificateReviews.getQuery();
		query.where("review_id=:recid", { recid });
		const allowedRoles = ["admin"];
		const userRole = req.user.roleName;
		if(!allowedRoles.includes(userRole)){
			query.andWhere('student_id=:userid', { userid: req.user.userid });
		}
		let selectFields = CertificateReviews.viewFields();
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
 * Route to insert CertificateReviews record
 * @route {POST} /certificatereviews/add
 */
router.post('/add/' , 
	[
		body('certificate_name').optional({nullable: true, checkFalsy: true}),
		body('certificate_photo').optional({nullable: true, checkFalsy: true}),
		body('certificate_type').optional({nullable: true, checkFalsy: true}),
		body('review_status').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req:HttpRequest, res:HttpResponse) {
	try{
		let modeldata = req.getValidFormData();
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.certificate_photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.certificate_photo, "certificate_photo");
			modeldata.certificate_photo = fileInfo.filepath;
		}
		await beforeAdd(modeldata, req);
		
		//save CertificateReviews record
		let record = await CertificateReviews.save(modeldata);
		await afterAdd(record, req);
		
		return res.send(record);
	} catch(err){
		return res.serverError(err);
	}
});
/**
    * Before create new record
    * @param {object} postdata // validated form data used to create new record
    */
async function beforeAdd(postdata, req:HttpRequest){
    //enter statement here
}
/**
    * After new record created
    * @param {object} record // newly created record
    */
async function afterAdd(record, req:HttpRequest){
    //enter statement here
}


/**
 * Route to get  CertificateReviews record for edit
 * @route {GET} /certificatereviews/edit/{recid}
 */
router.get('/edit/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = CertificateReviews.getQuery();
		const editFields = CertificateReviews.editFields(); // get fields to edit
		query.where("review_id=:recid", { recid });
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
 * Route to update  CertificateReviews record
 * @route {POST} /certificatereviews/edit/{recid}
 */
router.post('/edit/:recid' , 
	[
		body('certificate_name').optional({nullable: true, checkFalsy: true}),
		body('certificate_photo').optional({nullable: true, checkFalsy: true}),
		body('certificate_type').optional({nullable: true, checkFalsy: true}),
		body('review_status').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.params.recid;
		
		const editFields = CertificateReviews.editFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.certificate_photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.certificate_photo, "certificate_photo");
			modeldata.certificate_photo = fileInfo.filepath;
		}
		const query = CertificateReviews.getQuery();
		query.where("review_id=:recid", { recid });
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
 * Route to delete CertificateReviews record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /certificatereviews/delete/{recid}
 */
router.get('/delete/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = CertificateReviews.getQuery();
		query.where({'review_id': In(recid)});
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
