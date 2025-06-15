
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
			"users.username AS users_username", 
			"users.userphoto AS users_userphoto", 
			"courses.course_video AS course_video", 
			"courses.course_name AS course_name", 
			"courses.rating AS rating", 
			"courses.enrollment_count AS enrollment_count", 
			"courses.id AS id", 
			"users.userid AS users_userid"
		];
	}

	static exportListFields(): string[]{
		return [
			"users.username AS users_username", 
			"users.userphoto AS users_userphoto", 
			"courses.course_video AS course_video", 
			"courses.course_name AS course_name", 
			"courses.rating AS rating", 
			"courses.enrollment_count AS enrollment_count", 
			"courses.id AS id", 
			"users.userid AS users_userid"
		];
	}

	static viewFields(): string[]{
		return [
			"courses.id AS id", 
			"courses.course_name AS course_name", 
			"courses.course_video AS course_video", 
			"courses.teacher_id AS teacher_id", 
			"courses.rating AS rating", 
			"courses.enrollment_count AS enrollment_count", 
			"users.userid AS users_userid", 
			"users.username AS users_username", 
			"users.userpwd AS users_userpwd", 
			"users.useremail AS users_useremail", 
			"users.usertele AS users_usertele", 
			"users.userphoto AS users_userphoto", 
			"users.user_role_id AS users_user_role_id"
		];
	}

	static exportViewFields(): string[]{
		return [
			"courses.id AS id", 
			"courses.course_name AS course_name", 
			"courses.course_video AS course_video", 
			"courses.teacher_id AS teacher_id", 
			"courses.rating AS rating", 
			"courses.enrollment_count AS enrollment_count", 
			"users.userid AS users_userid", 
			"users.username AS users_username", 
			"users.userpwd AS users_userpwd", 
			"users.useremail AS users_useremail", 
			"users.usertele AS users_usertele", 
			"users.userphoto AS users_userphoto", 
			"users.user_role_id AS users_user_role_id"
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
			"Users.username LIKE :search", 
			"Courses.course_video LIKE :search", 
			"Courses.course_name LIKE :search", 
			"Courses.id LIKE :search", 
			"Users.userid LIKE :search", 
			"Users.userpwd LIKE :search", 
			"Users.useremail LIKE :search", 
			"Users.usertele LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


