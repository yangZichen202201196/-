/**
 * Express router providing  related routes
*/
import express from 'express';
import DB from '../datasource';
import { HttpRequest, HttpResponse } from '../helpers/http';
import { body }  from 'express-validator';
import validateFormData from '../helpers/validate_form';
import { In } from 'typeorm';
import StudyrecordsListExport from '../exports/StudyrecordsList';
const StudyRecords = DB.StudyRecords;
const router = express.Router();




/**
 * Route to list studyrecords records
 * @route {GET} /studyrecords/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = StudyRecords.getQuery();
		
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
			let searchFields = StudyRecords.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		
		const selectFields = StudyRecords.listFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('record_id', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		if(req.query.export){
			const exportFields = StudyRecords.exportListFields(); // get export fields
			query.select(exportFields);
			let records = await query.getRawMany();
			return StudyrecordsListExport(records, req, res);
		}
		
		//return records and pager info
		const pageData = await StudyRecords.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});


/**
 * Route to view StudyRecords record
 * @route {GET} /studyrecords/view/{recid}
 */
router.get('/view/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = StudyRecords.getQuery();
		query.where("record_id=:recid", { recid });
		let selectFields = StudyRecords.viewFields();
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
 * Route to insert StudyRecords record
 * @route {POST} /studyrecords/add
 */
router.post('/add/' , 
	[
		body('userid').not().isEmpty(),
		body('course_id').not().isEmpty(),
		body('progress').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('study_date').not().isEmpty(),
		body('study_duration').optional({nullable: true, checkFalsy: true}).isNumeric(),
	], validateFormData
, async function (req:HttpRequest, res:HttpResponse) {
	try{
		let modeldata = req.getValidFormData();
		
		//save StudyRecords record
		let record = await StudyRecords.save(modeldata);
		
		return res.send(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  StudyRecords record for edit
 * @route {GET} /studyrecords/edit/{recid}
 */
router.get('/edit/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = StudyRecords.getQuery();
		const editFields = StudyRecords.editFields(); // get fields to edit
		query.where("record_id=:recid", { recid });
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
 * Route to update  StudyRecords record
 * @route {POST} /studyrecords/edit/{recid}
 */
router.post('/edit/:recid' , 
	[
		body('userid').optional({nullable: true}).not().isEmpty(),
		body('course_id').optional({nullable: true}).not().isEmpty(),
		body('progress').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('study_date').optional({nullable: true}).not().isEmpty(),
		body('study_duration').optional({nullable: true, checkFalsy: true}).isNumeric(),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.params.recid;
		
		const editFields = StudyRecords.editFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = StudyRecords.getQuery();
		query.where("record_id=:recid", { recid });
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
 * Route to delete StudyRecords record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /studyrecords/delete/{recid}
 */
router.get('/delete/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = StudyRecords.getQuery();
		query.where({'record_id': In(recid)});
		 
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
