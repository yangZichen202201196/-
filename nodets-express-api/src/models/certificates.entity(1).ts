
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
	
	
	
	
	static listFields(): string[]{
		return [
			"certificate_id", 
			"certificate_photo", 
			"certificate_type", 
			"certificate_name", 
			"student_id", 
			"award_date", 
			"blocknum", 
			"tx_hash"
		];
	}

	static exportListFields(): string[]{
		return [
			"certificate_id", 
			"certificate_photo", 
			"certificate_type", 
			"certificate_name", 
			"student_id", 
			"award_date", 
			"blocknum", 
			"tx_hash"
		];
	}

	static viewFields(): string[]{
		return [
			"certificate_id", 
			"certificate_type", 
			"certificate_name", 
			"student_id", 
			"award_date", 
			"blocknum", 
			"tx_hash", 
			"certificate_photo"
		];
	}

	static exportViewFields(): string[]{
		return [
			"certificate_id", 
			"certificate_type", 
			"certificate_name", 
			"student_id", 
			"award_date", 
			"blocknum", 
			"tx_hash", 
			"certificate_photo"
		];
	}

	static editFields(): string[]{
		return [
			"certificate_type", 
			"certificate_name", 
			"student_id", 
			"award_date", 
			"blocknum", 
			"tx_hash", 
			"certificate_photo", 
			"certificate_id"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"certificate_id LIKE :search", 
			"certificate_name LIKE :search", 
			"student_id LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


