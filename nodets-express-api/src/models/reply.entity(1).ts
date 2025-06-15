
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'reply' })
export default class Reply extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("reply");
	}
	
	@PrimaryGeneratedColumn({name: 'reply_id'})
	reply_id: number

	@Column({name: 'replay_content' })
	replay_content: string
	
	@Column({name: 'username' })
	username: string
	
	@Column({name: 'id' })
	id: number
	
	
	
	
	static listFields(): string[]{
		return [
			"replay_content", 
			"username", 
			"reply_id"
		];
	}

	static exportListFields(): string[]{
		return [
			"replay_content", 
			"username", 
			"reply_id"
		];
	}

	static viewFields(): string[]{
		return [
			"reply_id", 
			"replay_content", 
			"username", 
			"id"
		];
	}

	static exportViewFields(): string[]{
		return [
			"reply_id", 
			"replay_content", 
			"username", 
			"id"
		];
	}

	static editFields(): string[]{
		return [
			"replay_content", 
			"id", 
			"reply_id"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"replay_content LIKE :search", 
			"username LIKE :search", 
			"reply_id LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


