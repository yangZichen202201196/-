/**
 * Express router providing  related routes
*/
import express from 'express';
import { rawQuery } from '../datasource';
import DB from '../datasource';
import * as csv from '@fast-csv/parse';
import { HttpRequest, HttpResponse } from '../helpers/http';
import { body }  from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware';
import validateFormData from '../helpers/validate_form';
import { In } from 'typeorm';
import CoursegradesListExport from '../exports/CoursegradesList';
const CourseGrades = DB.CourseGrades;
const router = express.Router();




/**
 * Route to list coursegrades records
 * @route {GET} /coursegrades/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = CourseGrades.getQuery();
		
		const fieldName = req.params.fieldname;
		const fieldValue = req.params.fieldvalue;
		const search = req.query.search;
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		
		if (fieldName){
			 //filter by a single column values
			query.where(`${fieldName}=:fieldValue`, {fieldValue});
		}
		
		if(req.query.course_name){
			let paramValue = req.query.course_name;
			query.andWhere("courses.course_name=:paramValue", { paramValue });
		}
		
		if(search){
			let searchFields = CourseGrades.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		
		// join Users table 
		query.leftJoin("Users", "users", "course_grades.student_id = users.userid");
		
		// join Courses table 
		query.leftJoin("Courses", "courses", "course_grades.course_id = courses.id");
		
		const selectFields = CourseGrades.listFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('grade_id', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		if(req.query.export){
			const exportFields = CourseGrades.exportListFields(); // get export fields
			query.select(exportFields);
			let records = await query.getRawMany();
			return CoursegradesListExport(records, req, res);
		}
		
		//return records and pager info
		const pageData = await CourseGrades.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});


/**
 * Route to import CourseGrades records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @route {GET} /coursegrades/importdata
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
							student_id: data['student_id'],
							course_id: data['course_id'],
							usual_score: data['usual_score'],
							exam_score: data['exam_score'],
							total_score: data['total_score'],
							credit: data['credit'],
							award_date: data['award_date'],
							blocknum: data['blocknum'],
							tx_hash: data['tx_hash'],
							timestamp: data['timestamp']
					}
					records.push(modeldata);
				}
			}).on("end", async() => {
				try{
					const query = CourseGrades.getQuery();
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
 * Route to view CourseGrades record
 * @route {GET} /coursegrades/view/{recid}
 */
router.get('/view/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = CourseGrades.getQuery();
		query.where("course_grades.grade_id=:recid", { recid });
		let selectFields = CourseGrades.viewFields();
		
		// join Users table 
		query.leftJoin("Users", "users", "course_grades.student_id = users.userid");
		
		// join Courses table 
		query.leftJoin("Courses", "courses", "course_grades.course_id = courses.id");
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
 * Route to insert CourseGrades record
 * @route {POST} /coursegrades/add
 */
router.post('/add/' , 
	[
		body('student_id').not().isEmpty(),
		body('course_id').not().isEmpty(),
		body('usual_score').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('exam_score').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('credit').optional({nullable: true, checkFalsy: true}).isNumeric(),
	], validateFormData
, async function (req:HttpRequest, res:HttpResponse) {
	try{
		let modeldata = req.getValidFormData();
		
		//save CourseGrades record
		let record = await CourseGrades.save(modeldata);
		await afterAdd(record, req);
		
		return res.send(record);
	} catch(err){
		return res.serverError(err);
	}
});
/**
    * After new record created
    * @param {object} record // newly created record
    */
async function afterAdd(record, req:HttpRequest){
    //enter statement here
}


/**
 * Route to get  CourseGrades record for edit
 * @route {GET} /coursegrades/edit/{recid}
 */
router.get('/edit/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = CourseGrades.getQuery();
		const editFields = CourseGrades.editFields(); // get fields to edit
		query.where("grade_id=:recid", { recid });
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
 * Route to update  CourseGrades record
 * @route {POST} /coursegrades/edit/{recid}
 */
router.post('/edit/:recid' , 
	[
		body('student_id').optional({nullable: true}).not().isEmpty(),
		body('course_id').optional({nullable: true}).not().isEmpty(),
		body('usual_score').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('exam_score').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('total_score').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('credit').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('blocknum').optional({nullable: true, checkFalsy: true}),
		body('tx_hash').optional({nullable: true, checkFalsy: true}),
		body('timestamp').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.params.recid;
		
		const editFields = CourseGrades.editFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = CourseGrades.getQuery();
		query.where("grade_id=:recid", { recid });
		query.select(editFields);
		const record = await query.getRawOne();
		if(!record){
			return res.recordNotFound();
		}
		Object.assign(record, modeldata); // update record with form input
		await query.update().set(modeldata).execute();
		await afterEdit(recid, record, req);
		return res.send(record);
	}
	catch(err){
		return res.serverError(err);
	}
});
/**
    * After page record updated
    * @param {string} recid // updated record id
    * @param {object} record // updated page record
    */
async function afterEdit(recid, record, req:HttpRequest){
    //enter statement here
    const sqltext = `SELECT * FROM course_grades WHERE grade_id=?`;
const queryParams: any[] = [recid];
const records = await rawQuery(sqltext, queryParams);
console.log("records", records[0]);
const gradeData = records[0];
console.log("gradeData", gradeData);
// 检查是否存在该成绩记录
if (gradeData) {
    // 插入通知到notifications表中
    const insertNotificationSql = `INSERT INTO notifications (student_id, content, is_read, create_time) VALUE (?, ?, ?, ?)`;
    const notificationParams = [
        gradeData.student_id, 
        "成绩更新提醒", 
        0, // is_read设为0表示未读
        new Date()
    ];
    const res = await rawQuery(insertNotificationSql, notificationParams);
    console.log("Notification inserted successfully.", res);
} else {
    console.log("Invalid grade record.");
}
}


/**
 * Route to delete CourseGrades record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /coursegrades/delete/{recid}
 */
router.get('/delete/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = CourseGrades.getQuery();
		query.where({'grade_id': In(recid)});
		 
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
