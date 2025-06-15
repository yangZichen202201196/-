/**
 * Express router providing  related routes
*/
import express from 'express';
import DB from '../datasource';
import { HttpRequest, HttpResponse } from '../helpers/http';
import { body }  from 'express-validator';
import validateFormData from '../helpers/validate_form';
import { In } from 'typeorm';
const Reply = DB.Reply;
const router = express.Router();




/**
 * Route to list reply records
 * @route {GET} /reply/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = Reply.getQuery();
		
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
			let searchFields = Reply.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		
		const selectFields = Reply.listFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('reply_id', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		
		//return records and pager info
		const pageData = await Reply.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});


/**
 * Route to view Reply record
 * @route {GET} /reply/view/{recid}
 */
router.get('/view/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Reply.getQuery();
		query.where("reply_id=:recid", { recid });
		let selectFields = Reply.viewFields();
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
 * Route to insert Reply record
 * @route {POST} /reply/add
 */
router.post('/add/' , 
	[
		body('replay_content').not().isEmpty(),
		body('id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req:HttpRequest, res:HttpResponse) {
	try{
		let modeldata = req.getValidFormData();
		modeldata['username'] = req.user.username;
		
		//save Reply record
		let record = await Reply.save(modeldata);
		
		return res.send(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Reply record for edit
 * @route {GET} /reply/edit/{recid}
 */
router.get('/edit/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Reply.getQuery();
		const editFields = Reply.editFields(); // get fields to edit
		query.where("reply_id=:recid", { recid });
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
 * Route to update  Reply record
 * @route {POST} /reply/edit/{recid}
 */
router.post('/edit/:recid' , 
	[
		body('replay_content').optional({nullable: true}).not().isEmpty(),
		body('id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.params.recid;
		
		const editFields = Reply.editFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = Reply.getQuery();
		query.where("reply_id=:recid", { recid });
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
 * Route to delete Reply record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /reply/delete/{recid}
 */
router.get('/delete/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = Reply.getQuery();
		query.where({'reply_id': In(recid)});
		 
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
