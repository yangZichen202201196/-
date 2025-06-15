
import excel from 'exceljs';
import utils from '../helpers/utils';
import ejs from 'ejs';
import config from '../config';
import { HttpRequest, HttpResponse } from '../helpers/http';

export default async function exportPageData(records, req:HttpRequest, res:HttpResponse) {
	try{
		let format = String(req.query.export).toLowerCase();
		let columns =  [
				{ header: "Users Username", key: "users_username" },
				{ header: "Users Userphoto", key: "users_userphoto" },
				{ header: "Usual Score", key: "usual_score" },
				{ header: "Exam Score", key: "exam_score" },
				{ header: "Total Score", key: "total_score" },
				{ header: "Credit", key: "credit" },
				{ header: "Courses Course Name", key: "courses_course_name" },
				{ header: "Blocknum", key: "blocknum" },
				{ header: "Tx Hash", key: "tx_hash" },
				{ header: "Timestamp", key: "timestamp" }
		]
		let filename = "coursegradeslist-report";
		if(format == "excel"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Course Grades");
			worksheet.columns = columns;
			worksheet.addRows(records);

			//set all columns to autowidth
			utils.excelAutoWidth(worksheet);

			const headerRow = worksheet.getRow(1);
			headerRow.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'f5b914' } }
			//headerRow.font = { name: 'Arial', size: 12 }

			res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
			return workbook.xlsx.write(res).then(function () {
				res.status(200).end();
			})
		}
		else if(format == "csv"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Course Grades");
			worksheet.columns = columns;
			worksheet.addRows(records);
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
			return workbook.csv.write(res).then(function () {
				res.status(200).end();
			})
		}
		else if(format == "pdf" || format == "print"){
			let page = "coursegradeslist.ejs";
			const viewData = { records, page, config, utils }
			let html = await ejs.renderFile("src/views/layouts/report.ejs", viewData);
			
			if (format == "pdf") {
				const puppeteerConfig = {
					margin: { top: '50px', right: '50px', bottom: '50px', left: '50px' },
					printBackground: true,
					format: 'A4',
					//landscape: true,
				}

				return res.generatePdf({ html, filename, puppeteerConfig, mediaType: 'screen' });
			}
			else {
				return res.ok(html);
			}
		}
	}
	catch(err){
		return res.serverError(err);
	}
}
