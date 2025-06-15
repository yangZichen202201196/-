/**
 * Express router providing  related routes
*/
import express from 'express';
import DB from '../datasource';
import { HttpRequest, HttpResponse } from '../helpers/http';
import { body }  from 'express-validator';
import validateFormData from '../helpers/validate_form';
import { In } from 'typeorm';
const Collents = DB.Collents;
const router = express.Router();




/**
 * Route to list collents records
 * @route {GET} /collents/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req:HttpRequest, res:HttpResponse) => {  
	try{
		const query = Collents.getQuery();
		
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
			let searchFields = Collents.searchFields(); // get columns to search
			query.andWhere(searchFields, {search: `%${search}%`});
		}
		
		const selectFields = Collents.listFields(); //get columns to select
		query.select(selectFields);
		
		// order by field
		const orderBy = req.getOrderBy('collent_id', 'DESC');
		if(orderBy){
			query.orderBy(orderBy.column, orderBy.orderType);
		}
		
		//return records and pager info
		const pageData = await Collents.paginate(query, page, limit);
		
		return res.send(pageData);
	}
	catch(err) {
		console.error("has crached", req.path, err);
		return res.serverError(err);
	}
});


/**
 * Route to view Collents record
 * @route {GET} /collents/view/{recid}
 */
router.get('/view/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Collents.getQuery();
		query.where("collent_id=:recid", { recid });
		let selectFields = Collents.viewFields();
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
 * Route to insert Collents record
 * @route {POST} /collents/add
 */
router.post('/add/' , 
	[
		body('userid').not().isEmpty(),
		body('id').not().isEmpty(),
	], validateFormData
, async function (req:HttpRequest, res:HttpResponse) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Collents record
		let record = await Collents.save(modeldata);
		
		return res.send(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Collents record for edit
 * @route {GET} /collents/edit/{recid}
 */
router.get('/edit/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		let recid = req.params.recid;
		let query = Collents.getQuery();
		const editFields = Collents.editFields(); // get fields to edit
		query.where("collent_id=:recid", { recid });
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
 * Route to update  Collents record
 * @route {POST} /collents/edit/{recid}
 */
router.post('/edit/:recid' , 
	[
		body('userid').optional({nullable: true}).not().isEmpty(),
		body('id').optional({nullable: true}).not().isEmpty(),
	], validateFormData
, async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = req.params.recid;
		
		const editFields = Collents.editFields();  // get fields to edit
		
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = Collents.getQuery();
		query.where("collent_id=:recid", { recid });
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
 * Route to delete Collents record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @route {GET} /collents/delete/{recid}
 */
router.get('/delete/:recid', async (req:HttpRequest, res:HttpResponse) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = Collents.getQuery();
		query.where({'collent_id': In(recid)});
		 
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
