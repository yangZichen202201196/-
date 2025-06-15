
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'collents' })
export default class Collents extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("collents");
	}
	
	@PrimaryGeneratedColumn({name: 'collent_id'})
	collent_id: number

	@Column({name: 'userid' })
	userid: number
	
	@Column({name: 'id' })
	id: number
	
	
	
	
	static listFields(): string[]{
		return [
			"collent_id", 
			"userid", 
			"id"
		];
	}

	static exportListFields(): string[]{
		return [
			"collent_id", 
			"userid", 
			"id"
		];
	}

	static viewFields(): string[]{
		return [
			"collent_id", 
			"userid", 
			"id"
		];
	}

	static exportViewFields(): string[]{
		return [
			"collent_id", 
			"userid", 
			"id"
		];
	}

	static editFields(): string[]{
		return [
			"collent_id", 
			"userid", 
			"id"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"collent_id LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


