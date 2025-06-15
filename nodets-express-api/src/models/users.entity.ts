
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
			"users.userid AS userid", 
			"users.username AS username", 
			"users.useremail AS useremail", 
			"users.usertele AS usertele", 
			"users.userphoto AS userphoto", 
			"roles.role_name AS roles_role_name", 
			"roles.role_id AS roles_role_id"
		];
	}

	static exportListFields(): string[]{
		return [
			"users.userid AS userid", 
			"users.username AS username", 
			"users.useremail AS useremail", 
			"users.usertele AS usertele", 
			"users.userphoto AS userphoto", 
			"roles.role_name AS roles_role_name", 
			"roles.role_id AS roles_role_id"
		];
	}

	static viewFields(): string[]{
		return [
			"users.userid AS userid", 
			"users.username AS username", 
			"users.useremail AS useremail", 
			"users.usertele AS usertele", 
			"users.user_role_id AS user_role_id", 
			"roles.role_id AS roles_role_id", 
			"roles.role_name AS roles_role_name"
		];
	}

	static exportViewFields(): string[]{
		return [
			"users.userid AS userid", 
			"users.username AS username", 
			"users.useremail AS useremail", 
			"users.usertele AS usertele", 
			"users.user_role_id AS user_role_id", 
			"roles.role_id AS roles_role_id", 
			"roles.role_name AS roles_role_name"
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
			"Users.userid LIKE :search", 
			"Users.username LIKE :search", 
			"Users.useremail LIKE :search", 
			"Users.usertele LIKE :search", 
			"Roles.role_name LIKE :search",
		];
		return '(' + fields.join(' OR ') + ')';
	}

	
	
}


declare global {
	namespace Express {
		interface User extends Users {}
	}
}

