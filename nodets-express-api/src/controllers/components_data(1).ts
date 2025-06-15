/**
 * Express router providing related routes to page component data
*/
import express from 'express';
import { rawQuery } from '../datasource';
import DB from '../datasource';
import { HttpRequest, HttpResponse } from '../helpers/http';
const router = express.Router();




 /**
 * Route to get student_id_option_list records
 * @route {GET} /components_data/student_id_option_list
 */
router.get('/student_id_option_list', async (req:HttpRequest, res:HttpResponse) => {
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
export default router;
