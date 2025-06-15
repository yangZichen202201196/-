
import { Entity, PrimaryColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'student_credits' })
export default class StudentCredits extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("student_credits");
	}
	
	@PrimaryColumn({name: 'student_id'})
	student_id: number

	@Column({name: 'total_credits' })
	total_credits: number
	
	
	
	
	static listFields(): string[]{
		return [
			"student_id", 
			"total_credits"
		];
	}

	static exportListFields(): string[]{
		return [
			"student_id", 
			"total_credits"
		];
	}

	static viewFields(): string[]{
		return [
			"student_id", 
			"total_credits"
		];
	}

	static exportViewFields(): string[]{
		return [
			"student_id", 
			"total_credits"
		];
	}

	static editFields(): string[]{
		return [
			"student_id", 
			"total_credits"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"student_id LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


