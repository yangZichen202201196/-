
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import BaseModel from './basemodel';

//2lines
@Entity({ name: 'users' })
export default class Users extends BaseModel {
	static getQuery(){
		return this.createQueryBuilder("users");
	}
	
	@PrimaryGeneratedColumn({name: 'userid'})
	userid: number

	@Column({name: 'username' })
	username: string
	
	@Column({name: 'userpwd' })
	userpwd: string
	
	@Column({name: 'useremail' })
	useremail: string
	
	@Column({name: 'usertele' })
	usertele: string
	
	@Column({name: 'userphoto' })
	userphoto: string
	
	@Column({name: 'user_role_id' })
	user_role_id: number
	
	
  	public roleName: any;

	
	
	static listFields(): string[]{
		return [
			"userid", 
			"username", 
			"useremail", 
			"usertele", 
			"userphoto", 
			"user_role_id"
		];
	}

	static exportListFields(): string[]{
		return [
			"userid", 
			"username", 
			"useremail", 
			"usertele", 
			"userphoto", 
			"user_role_id"
		];
	}

	static viewFields(): string[]{
		return [
			"userid", 
			"username", 
			"useremail", 
			"usertele", 
			"user_role_id"
		];
	}

	static exportViewFields(): string[]{
		return [
			"userid", 
			"username", 
			"useremail", 
			"usertele", 
			"user_role_id"
		];
	}

	static accounteditFields(): string[]{
		return [
			"userid", 
			"username", 
			"usertele", 
			"userphoto", 
			"user_role_id"
		];
	}

	static accountviewFields(): string[]{
		return [
			"userid", 
			"username", 
			"useremail", 
			"usertele", 
			"user_role_id"
		];
	}

	static exportAccountviewFields(): string[]{
		return [
			"userid", 
			"username", 
			"useremail", 
			"usertele", 
			"user_role_id"
		];
	}

	static editFields(): string[]{
		return [
			"userid", 
			"username", 
			"usertele", 
			"userphoto", 
			"user_role_id"
		];
	}

	
	static searchFields(): string{
		const fields = [
			"userid LIKE :search", 
			"username LIKE :search", 
			"useremail LIKE :search", 
			"usertele LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


declare global {
	namespace Express {
		interface User extends Users {}
	}
}

