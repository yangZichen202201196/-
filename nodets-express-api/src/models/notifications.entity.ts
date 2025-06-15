
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'notifications' })
export default class Notifications extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("notifications");
	}
	
	@PrimaryGeneratedColumn({name: 'notification_id'})
	notification_id: number

	@Column({name: 'student_id' })
	student_id: number
	
	@Column({name: 'content' })
	content: string
	
	@Column({name: 'create_time' })
	create_time: string
	
	@Column({name: 'is_read' })
	is_read: number
	
	
	
	
	static listFields(): string[]{
		return [
			"notification_id", 
			"student_id", 
			"content", 
			"create_time", 
			"is_read"
		];
	}

	static exportListFields(): string[]{
		return [
			"notification_id", 
			"student_id", 
			"content", 
			"create_time", 
			"is_read"
		];
	}

	static viewFields(): string[]{
		return [
			"notification_id", 
			"student_id", 
			"content", 
			"create_time", 
			"is_read"
		];
	}

	static exportViewFields(): string[]{
		return [
			"notification_id", 
			"student_id", 
			"content", 
			"create_time", 
			"is_read"
		];
	}

	static editFields(): string[]{
		return [
			"notification_id", 
			"content", 
			"is_read"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"notification_id LIKE :search", 
			"content LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


