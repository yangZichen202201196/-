
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'study_records' })
export default class StudyRecords extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("study_records");
	}
	
	@PrimaryGeneratedColumn({name: 'record_id'})
	record_id: number

	@Column({name: 'userid' })
	userid: number
	
	@Column({name: 'course_id' })
	course_id: number
	
	@Column({name: 'progress' })
	progress: number
	
	@Column({name: 'study_date' })
	study_date: string
	
	@Column({name: 'study_duration' })
	study_duration: number
	
	
	
	
	static listFields(): string[]{
		return [
			"record_id", 
			"userid", 
			"course_id", 
			"progress", 
			"study_date", 
			"study_duration"
		];
	}

	static exportListFields(): string[]{
		return [
			"record_id", 
			"userid", 
			"course_id", 
			"progress", 
			"study_date", 
			"study_duration"
		];
	}

	static viewFields(): string[]{
		return [
			"record_id", 
			"userid", 
			"course_id", 
			"progress", 
			"study_date", 
			"study_duration"
		];
	}

	static exportViewFields(): string[]{
		return [
			"record_id", 
			"userid", 
			"course_id", 
			"progress", 
			"study_date", 
			"study_duration"
		];
	}

	static editFields(): string[]{
		return [
			"userid", 
			"course_id", 
			"progress", 
			"study_date", 
			"study_duration", 
			"record_id"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"record_id LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


