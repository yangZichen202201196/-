export default {
	app: {
		name: "链上学堂",
		url: "http://localhost:8060",
		frontendUrl: "http://localhost:8050",
		secret: "d88d9182a5ca3c9b8aa1fb034103beae",
		language: "english",
		publicDir: "public",
	},
	meta: {
		author:"",
		description: "__metadescription",
		charset: "UTF-8",
	},
	auth: {
		userTokenSecret: "ed86792A-1ax%W@cf5e9YY6Q!!0-2d6cadb301083f86f85a",
		apiTokenSecret: "bc379eb8$Xax%W!890279B#Q-!07c66208d6741e64858abd",
		jwtDuration: 30, //in minutes
		otpDuration: 5, //in minutes
	},
	database: {
		name:"software",
		type: "mysql",
		host: "localhost",
		username: "root",
		password: "123456",
		port: "",
		charset: "utf8",
		recordlimit: 10,
		ordertype: "DESC"
	},
	mail: {
		username:"3067003323@qq.com",
		password: "ewfeyzbonikrbonegg",
		senderemail:"3067003323@qq.com",
		sendername:"3067003323@qq.com",
		host: "stmp.qq.com",
		secure: true,
		port: "465"
	},
	upload: {
		tempDir: "uploads/temp/",
		importdata: {
			filenameType: "timestamp",
			extensions: "csv",
			maxFiles: "10",
			maxFileSize: "3",
			returnFullpath: "false",
			filenamePrefix: "",
			uploadDir: "uploads/files/"
		},
		
		certificate_photo: {
			filenameType: "random",
			extensions: "jpg,png,gif,jpeg",
			maxFiles: "1",
			maxFileSize: "3", // in MB
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			imageResize:  [ 
				{name: "small", width: 100, height: 100, mode: "cover"}, 
				{name: "medium", width: 480, height: 480, mode: "inside"}, 
				{name: "large", width: 1024, height: 760, mode: "inside"}
			],

		},

		course_video: {
			filenameType: "random",
			extensions: "mp3,mp4,webm,wav,avi,mpg,mpeg",
			maxFiles: "1",
			maxFileSize: "10", // in MB
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			imageResize:  [ 
				{name: "small", width: 100, height: 100, mode: "cover"}, 
				{name: "medium", width: 480, height: 480, mode: "inside"}, 
				{name: "large", width: 1024, height: 760, mode: "inside"}
			],

		},

		userphoto: {
			filenameType: "random",
			extensions: "jpg,png,gif,jpeg",
			maxFiles: "1",
			maxFileSize: "3", // in MB
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			imageResize:  [ 
				{name: "small", width: 100, height: 100, mode: "cover"}, 
				{name: "medium", width: 480, height: 480, mode: "inside"}, 
				{name: "large", width: 1024, height: 760, mode: "inside"}
			],

		},

	},
	s3: {
		secretAccessKey: "",
		accessKeyId: "",
		region: "us-west-2",
		bucket: "",
	},
	
	locales: {
		'english': 'English',
	}

}