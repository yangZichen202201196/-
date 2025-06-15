
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'likes' })
export default class Likes extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("likes");
	}
	
	@PrimaryGeneratedColumn({name: 'like_id'})
	like_id: number

	@Column({name: 'id' })
	id: number
	
	@Column({name: 'userid' })
	userid: number
	
	
	
	
	static listFields(): string[]{
		return [
			"like_id", 
			"id", 
			"userid"
		];
	}

	static exportListFields(): string[]{
		return [
			"like_id", 
			"id", 
			"userid"
		];
	}

	static viewFields(): string[]{
		return [
			"like_id", 
			"id", 
			"userid"
		];
	}

	static exportViewFields(): string[]{
		return [
			"like_id", 
			"id", 
			"userid"
		];
	}

	static editFields(): string[]{
		return [
			"like_id", 
			"id", 
			"userid"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"like_id LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


