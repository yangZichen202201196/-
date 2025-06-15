
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'courses' })
export default class Courses extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("courses");
	}
	
	@PrimaryGeneratedColumn({name: 'id'})
	id: number

	@Column({name: 'course_name' })
	course_name: string
	
	@Column({name: 'course_video' })
	course_video: string
	
	@Column({name: 'teacher_id' })
	teacher_id: number
	
	@Column({name: 'rating' })
	rating: number
	
	@Column({name: 'enrollment_count' })
	enrollment_count: number
	
	
	
	
	static listFields(): string[]{
		return [
			"id", 
			"course_name", 
			"course_video", 
			"teacher_id", 
			"rating", 
			"enrollment_count"
		];
	}

	static exportListFields(): string[]{
		return [
			"id", 
			"course_name", 
			"course_video", 
			"teacher_id", 
			"rating", 
			"enrollment_count"
		];
	}

	static viewFields(): string[]{
		return [
			"id", 
			"course_name", 
			"course_video", 
			"teacher_id", 
			"rating", 
			"enrollment_count"
		];
	}

	static exportViewFields(): string[]{
		return [
			"id", 
			"course_name", 
			"course_video", 
			"teacher_id", 
			"rating", 
			"enrollment_count"
		];
	}

	static editFields(): string[]{
		return [
			"course_name", 
			"course_video", 
			"teacher_id", 
			"rating", 
			"enrollment_count", 
			"id"
		];
	}

	static loginpagelistFields(): string[]{
		return [
			"id", 
			"course_name", 
			"course_video", 
			"enrollment_count"
		];
	}

	static exportLoginpagelistFields(): string[]{
		return [
			"id", 
			"course_name", 
			"course_video", 
			"enrollment_count"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"id LIKE :search", 
			"course_name LIKE :search", 
			"course_video LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


