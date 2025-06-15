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
import CoursesListExport from '../exports/CoursesList';
const Courses = DB.Courses;
const router = express.Router();




/**
 * Route to list courses records
 * @route {GET} /courses/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = Courses.getQuery();
		
		const fieldName = req.params.fieldname;
		const fieldValue = req.params.fieldvalue;
		const search = req.query.search;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 3;
		
		if (fieldName){
			 //filter by a single column values
			query.where(`${fieldName}=:fieldValue`, {fieldValue});
		}
		
		
		if(search){
			let searchFields = Courses.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		
		const selectFields = Courses.listFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('id', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		if(req.query.export){
			const exportFields = Courses.exportListFields(); // get export fields
			query.select(exportFields);
			let records = await query.getRawMany();
			return CoursesListExport(records, req, res);
		}
		
		//return records and pager info
		const pageData = await Courses.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});


/**
 * Route to import Courses records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @route {GET} /courses/importdata
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
							course_name: data['course_name'],
							course_video: data['course_video'],
							teacher_id: data['teacher_id'],
							rating: data['rating'],
							enrollment_count: data['enrollment_count']
					}
					records.push(modeldata);
				}
			}).on("end", async() => {
				try{
					const query = Courses.getQuery();
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
 * Route to view Courses record
 * @route {GET} /courses/view/{recid}
 */
router.get('/view/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Courses.getQuery();
		query.where("id=:recid", { recid });
		let selectFields = Courses.viewFields();
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
 * Route to insert Courses record
 * @route {POST} /courses/add
 */
router.post('/add/' , 
	[
		body('course_name').optional({nullable: true, checkFalsy: true}),
		body('course_video').optional({nullable: true, checkFalsy: true}),
		body('teacher_id').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('rating').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('enrollment_count').optional({nullable: true, checkFalsy: true}).isNumeric(),
	], validateFormData
, async function (req:HttpRequest, res:HttpResponse) {
	try{
		let modeldata = req.getValidFormData();
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.course_video !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.course_video, "course_video");
			modeldata.course_video = fileInfo.filepath;
		}
		
		//save Courses record
		let record = await Courses.save(modeldata);
		
		return res.send(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Courses record for edit
 * @route {GET} /courses/edit/{recid}
 */
router.get('/edit/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Courses.getQuery();
		const editFields = Courses.editFields(); // get fields to edit
		query.where("id=:recid", { recid });
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
 * Route to update  Courses record
 * @route {POST} /courses/edit/{recid}
 */
router.post('/edit/:recid' , 
	[
		body('course_name').optional({nullable: true, checkFalsy: true}),
		body('course_video').optional({nullable: true, checkFalsy: true}),
		body('teacher_id').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('rating').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('enrollment_count').optional({nullable: true, checkFalsy: true}).isNumeric(),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.params.recid;
		
		const editFields = Courses.editFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.course_video !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.course_video, "course_video");
			modeldata.course_video = fileInfo.filepath;
		}
		const query = Courses.getQuery();
		query.where("id=:recid", { recid });
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
 * Route to delete Courses record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /courses/delete/{recid}
 */
router.get('/delete/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = Courses.getQuery();
		query.where({'id': In(recid)});
		 
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


/**
 * Route to list courses records
 * @route {GET} /courses/index/{fieldname}/{fieldvalue}
 */
router.get('/loginpagelist/:fieldname?/:fieldvalue?', async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = Courses.getQuery();
		
		const fieldName = req.params.fieldname;
		const fieldValue = req.params.fieldvalue;
		const search = req.query.search;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 2;
		
		if (fieldName){
			 //filter by a single column values
			query.where(`${fieldName}=:fieldValue`, {fieldValue});
		}
		
		
		if(search){
			let searchFields = Courses.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		
		const selectFields = Courses.loginpagelistFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('id', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		
		//return records and pager info
		const pageData = await Courses.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});
export default router;
