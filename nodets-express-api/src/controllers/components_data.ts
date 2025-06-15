/**
 * Express router providing related routes to page component data
*/
import express from 'express';
import { rawQuery } from '../datasource';
import DB from '../datasource';
import { HttpRequest, HttpResponse } from '../helpers/http';
const router = express.Router();




 /**
 * Route to get certificate_name_option_list records
 * @route {GET} /components_data/certificate_name_option_list
 */
router.get('/certificate_name_option_list', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let sqltext = `SELECT  DISTINCT course_name AS value,course_name AS label FROM courses` ;
		let records = await rawQuery(sqltext );
		return res.send(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get userid_option_list records
 * @route {GET} /components_data/userid_option_list
 */
router.get('/userid_option_list', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let sqltext = `SELECT userid as value, username as label FROM users` ;
		let records = await rawQuery(sqltext );
		return res.send(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_option_list records
 * @route {GET} /components_data/id_option_list
 */
router.get('/id_option_list', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let sqltext = `SELECT id as value, course_name as label FROM courses` ;
		let records = await rawQuery(sqltext );
		return res.send(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get student_id_option_list records
 * @route {GET} /components_data/student_id_option_list
 */
router.get('/student_id_option_list', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let sqltext = `SELECT userid as value, username as label FROM users where user_role_id = 2` ;
		let records = await rawQuery(sqltext );
		return res.send(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get role_id_option_list records
 * @route {GET} /components_data/role_id_option_list
 */
router.get('/role_id_option_list', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let sqltext = `SELECT role_id as value, role_name as label FROM roles` ;
		let records = await rawQuery(sqltext );
		return res.send(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get id_option_list_2 records
 * @route {GET} /components_data/id_option_list_2
 */
router.get('/id_option_list_2', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let sqltext = `SELECT  DISTINCT id AS value,id AS label FROM courses` ;
		let records = await rawQuery(sqltext );
		return res.send(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Users table
 * @route {GET} /components_data/users_username_exist/{fieldvalue}
 */
router.get('/users_username_exist/:fieldvalue', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let val = req.params.fieldvalue;
		if(val){
			let recordExists = await DB.Users.getQuery().where({'username': val}).exists();
			return res.send(recordExists);
		}
		return res.send("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Users table
 * @route {GET} /components_data/users_useremail_exist/{fieldvalue}
 */
router.get('/users_useremail_exist/:fieldvalue', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let val = req.params.fieldvalue;
		if(val){
			let recordExists = await DB.Users.getQuery().where({'useremail': val}).exists();
			return res.send(recordExists);
		}
		return res.send("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get certificate_type_option_list records
 * @route {GET} /components_data/certificate_type_option_list
 */
router.get('/certificate_type_option_list', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let sqltext = `SELECT  DISTINCT certificate_type AS value,certificate_type AS label FROM certificates` ;
		let records = await rawQuery(sqltext );
		return res.send(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get linechart_course_grade records
 * @route {GET} /components_data/linechart_course_grade
 */
router.get('/linechart_course_grade',  async (req:HttpRequest, res:HttpResponse) => {
	let chartData = { labels:[], datasets:[] };
	try{
		let sqltext = `SELECT 
    student_id,
    AVG(usual_score) AS avg_usual,
    AVG(exam_score) AS avg_exam,
    AVG(usual_score)*0.3 + AVG(exam_score)*0.7 AS weighted_score
FROM course_grades
GROUP BY student_id
ORDER BY weighted_score DESC;` ;
		let records = await rawQuery(sqltext );
		chartData['labels'] = records.map(item => item.student_id);
		let dataset1 = {
			data: records.map(item => Number(item.avg_usual)),
			label: "usual",
			backgroundColor: "--RandomColor--", 
			borderColor: "--RandomColor--", 
			borderWidth: "2",
		};
		chartData.datasets.push(dataset1);
		let dataset2 = {
			data: records.map(item => Number(item.avg_exam)),
			label: "exam",
			backgroundColor: "--RandomColor--", 
			borderColor: "--RandomColor--", 
			borderWidth: "2",
		};
		chartData.datasets.push(dataset2);
		let dataset3 = {
			data: records.map(item => Number(item.weighted_score)),
			label: "total",
			backgroundColor: "--RandomColor--", 
			borderColor: "--RandomColor--", 
			borderWidth: "2",
		};
		chartData.datasets.push(dataset3);
		return res.send(chartData) ;
	}
	catch(err) {
		return res.serverError(err);
	}
});
export default router;
