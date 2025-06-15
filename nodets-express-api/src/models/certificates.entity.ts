
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'certificates' })
export default class Certificates extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("certificates");
	}
	
	@PrimaryGeneratedColumn({name: 'certificate_id'})
	certificate_id: number

	@Column({name: 'certificate_type' })
	certificate_type: string
	
	@Column({name: 'certificate_name' })
	certificate_name: string
	
	@Column({name: 'student_id' })
	student_id: number
	
	@Column({name: 'award_date' })
	award_date: string
	
	@Column({name: 'blocknum' })
	blocknum: number
	
	@Column({name: 'tx_hash' })
	tx_hash: string
	
	@Column({name: 'certificate_photo' })
	certificate_photo: string
	
	@Column({name: 'timestamp' })
	timestamp: string
	
	
	
	
	static listFields(): string[]{
		return [
			"certificates.certificate_id AS certificate_id", 
			"certificates.certificate_photo AS certificate_photo", 
			"certificates.certificate_type AS certificate_type", 
			"certificates.certificate_name AS certificate_name", 
			"users.username AS users_username", 
			"users.userid AS users_userid", 
			"certificates.student_id AS student_id"
		];
	}

	static exportListFields(): string[]{
		return [
			"certificates.certificate_id AS certificate_id", 
			"certificates.certificate_photo AS certificate_photo", 
			"certificates.certificate_type AS certificate_type", 
			"certificates.certificate_name AS certificate_name", 
			"users.username AS users_username", 
			"users.userid AS users_userid", 
			"certificates.student_id AS student_id"
		];
	}

	static viewFields(): string[]{
		return [
			"certificates.certificate_id AS certificate_id", 
			"certificates.certificate_type AS certificate_type", 
			"certificates.certificate_name AS certificate_name", 
			"certificates.student_id AS student_id", 
			"certificates.award_date AS award_date", 
			"certificates.blocknum AS blocknum", 
			"certificates.tx_hash AS tx_hash", 
			"certificates.certificate_photo AS certificate_photo", 
			"certificates.timestamp AS timestamp", 
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
			"certificates.certificate_id AS certificate_id", 
			"certificates.certificate_type AS certificate_type", 
			"certificates.certificate_name AS certificate_name", 
			"certificates.student_id AS student_id", 
			"certificates.award_date AS award_date", 
			"certificates.blocknum AS blocknum", 
			"certificates.tx_hash AS tx_hash", 
			"certificates.certificate_photo AS certificate_photo", 
			"certificates.timestamp AS timestamp", 
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
			"certificate_type", 
			"certificate_name", 
			"certificate_photo", 
			"certificate_id"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"Certificates.certificate_id LIKE :search", 
			"Certificates.certificate_name LIKE :search", 
			"Users.username LIKE :search", 
			"Certificates.student_id LIKE :search", 
			"Certificates.timestamp LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


