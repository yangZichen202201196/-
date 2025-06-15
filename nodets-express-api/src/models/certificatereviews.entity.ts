
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'certificate_reviews' })
export default class CertificateReviews extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("certificate_reviews");
	}
	
	@PrimaryGeneratedColumn({name: 'review_id'})
	review_id: number

	@Column({name: 'certificate_name' })
	certificate_name: string
	
	@Column({name: 'certificate_photo' })
	certificate_photo: string
	
	@Column({name: 'certificate_type' })
	certificate_type: string
	
	@Column({name: 'student_id' })
	student_id: number
	
	@Column({name: 'award_date' })
	award_date: string
	
	@Column({name: 'submit_time' })
	submit_time: string
	
	@Column({name: 'review_status' })
	review_status: number
	
	
	
	
	static listFields(): string[]{
		return [
			"review_id", 
			"certificate_name", 
			"certificate_photo", 
			"certificate_type", 
			"student_id", 
			"submit_time", 
			"review_status"
		];
	}

	static exportListFields(): string[]{
		return [
			"review_id", 
			"certificate_name", 
			"certificate_photo", 
			"certificate_type", 
			"student_id", 
			"submit_time", 
			"review_status"
		];
	}

	static viewFields(): string[]{
		return [
			"review_id", 
			"certificate_name", 
			"certificate_photo", 
			"certificate_type", 
			"student_id", 
			"award_date", 
			"submit_time", 
			"review_status"
		];
	}

	static exportViewFields(): string[]{
		return [
			"review_id", 
			"certificate_name", 
			"certificate_photo", 
			"certificate_type", 
			"student_id", 
			"award_date", 
			"submit_time", 
			"review_status"
		];
	}

	static editFields(): string[]{
		return [
			"certificate_name", 
			"certificate_photo", 
			"certificate_type", 
			"award_date", 
			"review_status", 
			"review_id"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"review_id LIKE :search", 
			"certificate_name LIKE :search", 
			"certificate_type LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


