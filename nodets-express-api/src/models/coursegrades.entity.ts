
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'course_grades' })
export default class CourseGrades extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("course_grades");
	}
	
	@PrimaryGeneratedColumn({name: 'grade_id'})
	grade_id: number

	@Column({name: 'student_id' })
	student_id: number
	
	@Column({name: 'course_id' })
	course_id: number
	
	@Column({name: 'usual_score' })
	usual_score: number
	
	@Column({name: 'exam_score' })
	exam_score: number
	
	@Column({name: 'total_score' })
	total_score: number
	
	@Column({name: 'credit' })
	credit: number
	
	@Column({name: 'award_date' })
	award_date: string
	
	@Column({name: 'blocknum' })
	blocknum: string
	
	@Column({name: 'tx_hash' })
	tx_hash: string
	
	@Column({name: 'timestamp' })
	timestamp: string
	
	
	
	
	static listFields(): string[]{
		return [
			"users.username AS users_username", 
			"users.userphoto AS users_userphoto", 
			"course_grades.usual_score AS usual_score", 
			"course_grades.exam_score AS exam_score", 
			"course_grades.credit AS credit", 
			"(course_grades.exam_score * 0.7) + (course_grades.usual_score * 0.3) AS total_score", 
			"courses.course_name AS courses_course_name", 
			"course_grades.blocknum AS blocknum", 
			"course_grades.tx_hash AS tx_hash", 
			"course_grades.timestamp AS timestamp", 
			"users.userid AS users_userid", 
			"courses.id AS courses_id", 
			"course_grades.grade_id AS grade_id"
		];
	}

	static exportListFields(): string[]{
		return [
			"users.username AS users_username", 
			"users.userphoto AS users_userphoto", 
			"course_grades.usual_score AS usual_score", 
			"course_grades.exam_score AS exam_score", 
			"course_grades.credit AS credit", 
			"(course_grades.exam_score * 0.7) + (course_grades.usual_score * 0.3) AS total_score", 
			"courses.course_name AS courses_course_name", 
			"course_grades.blocknum AS blocknum", 
			"course_grades.tx_hash AS tx_hash", 
			"course_grades.timestamp AS timestamp", 
			"users.userid AS users_userid", 
			"courses.id AS courses_id", 
			"course_grades.grade_id AS grade_id"
		];
	}

	static viewFields(): string[]{
		return [
			"course_grades.grade_id AS grade_id", 
			"course_grades.student_id AS student_id", 
			"course_grades.course_id AS course_id", 
			"course_grades.usual_score AS usual_score", 
			"course_grades.exam_score AS exam_score", 
			"course_grades.total_score AS total_score", 
			"course_grades.credit AS credit", 
			"course_grades.award_date AS award_date", 
			"users.userid AS users_userid", 
			"users.username AS users_username", 
			"users.userpwd AS users_userpwd", 
			"users.useremail AS users_useremail", 
			"users.usertele AS users_usertele", 
			"users.userphoto AS users_userphoto", 
			"users.user_role_id AS users_user_role_id", 
			"courses.id AS courses_id", 
			"courses.course_name AS courses_course_name", 
			"courses.course_video AS courses_course_video", 
			"courses.teacher_id AS courses_teacher_id", 
			"courses.rating AS courses_rating", 
			"courses.enrollment_count AS courses_enrollment_count", 
			"course_grades.blocknum AS blocknum", 
			"course_grades.tx_hash AS tx_hash", 
			"course_grades.timestamp AS timestamp"
		];
	}

	static exportViewFields(): string[]{
		return [
			"course_grades.grade_id AS grade_id", 
			"course_grades.student_id AS student_id", 
			"course_grades.course_id AS course_id", 
			"course_grades.usual_score AS usual_score", 
			"course_grades.exam_score AS exam_score", 
			"course_grades.total_score AS total_score", 
			"course_grades.credit AS credit", 
			"course_grades.award_date AS award_date", 
			"users.userid AS users_userid", 
			"users.username AS users_username", 
			"users.userpwd AS users_userpwd", 
			"users.useremail AS users_useremail", 
			"users.usertele AS users_usertele", 
			"users.userphoto AS users_userphoto", 
			"users.user_role_id AS users_user_role_id", 
			"courses.id AS courses_id", 
			"courses.course_name AS courses_course_name", 
			"courses.course_video AS courses_course_video", 
			"courses.teacher_id AS courses_teacher_id", 
			"courses.rating AS courses_rating", 
			"courses.enrollment_count AS courses_enrollment_count", 
			"course_grades.blocknum AS blocknum", 
			"course_grades.tx_hash AS tx_hash", 
			"course_grades.timestamp AS timestamp"
		];
	}

	static editFields(): string[]{
		return [
			"student_id", 
			"course_id", 
			"usual_score", 
			"exam_score", 
			"total_score", 
			"credit", 
			"blocknum", 
			"tx_hash", 
			"timestamp", 
			"grade_id"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"Users.username LIKE :search", 
			"Coursegrades.blocknum LIKE :search", 
			"Coursegrades.tx_hash LIKE :search", 
			"Coursegrades.timestamp LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


