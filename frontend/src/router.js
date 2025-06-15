
import { createRouter, createWebHashHistory } from 'vue-router';

import { useAuth } from 'src/composables/auth';


function passRouteToProps(route){
	return {
		queryParams: route.query,
		fieldName: route.params.fieldName, 
		fieldValue: route.params.fieldValue
	}
}


let routes = [
	//Dashboard routes


//certificatereviews routes
			{
				path: '/certificatereviews/:fieldName?/:fieldValue?',
				name: 'certificatereviewslist',
				component: () => import('./pages/certificatereviews/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/certificatereviews/view/:id', 
				name: 'certificatereviewsview', 
				component: () => import('./pages/certificatereviews/view.vue'), 
				props: true
			},
		
			{ 
				path: '/certificatereviews/add', 
				name: 'certificatereviewsadd', 
				component: () => import('./pages/certificatereviews/add.vue'), 
				props: true
			},
	
			{ 
				path: '/certificatereviews/edit/:id', 
				name: 'certificatereviewsedit', 
				component: () => import('./pages/certificatereviews/edit.vue'), 
				props: true
			},
		

//certificates routes
			{
				path: '/certificates/:fieldName?/:fieldValue?',
				name: 'certificateslist',
				component: () => import('./pages/certificates/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/certificates/view/:id', 
				name: 'certificatesview', 
				component: () => import('./pages/certificates/view.vue'), 
				props: true
			},
		
			{ 
				path: '/certificates/add', 
				name: 'certificatesadd', 
				component: () => import('./pages/certificates/add.vue'), 
				props: true
			},
	
			{ 
				path: '/certificates/edit/:id', 
				name: 'certificatesedit', 
				component: () => import('./pages/certificates/edit.vue'), 
				props: true
			},
		

//collents routes
			{
				path: '/collents/:fieldName?/:fieldValue?',
				name: 'collentslist',
				component: () => import('./pages/collents/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/collents/view/:id', 
				name: 'collentsview', 
				component: () => import('./pages/collents/view.vue'), 
				props: true
			},
		
			{ 
				path: '/collents/add', 
				name: 'collentsadd', 
				component: () => import('./pages/collents/add.vue'), 
				props: true
			},
	
			{ 
				path: '/collents/edit/:id', 
				name: 'collentsedit', 
				component: () => import('./pages/collents/edit.vue'), 
				props: true
			},
		

//coursegrades routes
			{
				path: '/coursegrades/:fieldName?/:fieldValue?',
				name: 'coursegradeslist',
				component: () => import('./pages/coursegrades/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/coursegrades/view/:id', 
				name: 'coursegradesview', 
				component: () => import('./pages/coursegrades/view.vue'), 
				props: true
			},
		
			{ 
				path: '/coursegrades/add', 
				name: 'coursegradesadd', 
				component: () => import('./pages/coursegrades/add.vue'), 
				props: true
			},
	
			{ 
				path: '/coursegrades/edit/:id', 
				name: 'coursegradesedit', 
				component: () => import('./pages/coursegrades/edit.vue'), 
				props: true
			},
		

//courses routes
			{
				path: '/courses/:fieldName?/:fieldValue?',
				name: 'courseslist',
				component: () => import('./pages/courses/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/courses/view/:id', 
				name: 'coursesview', 
				component: () => import('./pages/courses/view.vue'), 
				props: true
			},
		
			{ 
				path: '/courses/add', 
				name: 'coursesadd', 
				component: () => import('./pages/courses/add.vue'), 
				props: true
			},
	
			{ 
				path: '/courses/edit/:id', 
				name: 'coursesedit', 
				component: () => import('./pages/courses/edit.vue'), 
				props: true
			},
		
			{
				path: '/courses/loginpagelist/:fieldName?/:fieldValue?',
				name: 'coursesloginpagelist',
				component: () => import('./pages/courses/loginpagelist.vue'), 
				props: route => passRouteToProps(route)
			},
	

//likes routes
			{
				path: '/likes/:fieldName?/:fieldValue?',
				name: 'likeslist',
				component: () => import('./pages/likes/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/likes/view/:id', 
				name: 'likesview', 
				component: () => import('./pages/likes/view.vue'), 
				props: true
			},
		
			{ 
				path: '/likes/add', 
				name: 'likesadd', 
				component: () => import('./pages/likes/add.vue'), 
				props: true
			},
	
			{ 
				path: '/likes/edit/:id', 
				name: 'likesedit', 
				component: () => import('./pages/likes/edit.vue'), 
				props: true
			},
		

//notifications routes
			{
				path: '/notifications/:fieldName?/:fieldValue?',
				name: 'notificationslist',
				component: () => import('./pages/notifications/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/notifications/view/:id', 
				name: 'notificationsview', 
				component: () => import('./pages/notifications/view.vue'), 
				props: true
			},
		
			{ 
				path: '/notifications/add', 
				name: 'notificationsadd', 
				component: () => import('./pages/notifications/add.vue'), 
				props: true
			},
	
			{ 
				path: '/notifications/edit/:id', 
				name: 'notificationsedit', 
				component: () => import('./pages/notifications/edit.vue'), 
				props: true
			},
		

//permissions routes
			{
				path: '/permissions/:fieldName?/:fieldValue?',
				name: 'permissionslist',
				component: () => import('./pages/permissions/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/permissions/view/:id', 
				name: 'permissionsview', 
				component: () => import('./pages/permissions/view.vue'), 
				props: true
			},
		
			{ 
				path: '/permissions/add', 
				name: 'permissionsadd', 
				component: () => import('./pages/permissions/add.vue'), 
				props: true
			},
	
			{ 
				path: '/permissions/edit/:id', 
				name: 'permissionsedit', 
				component: () => import('./pages/permissions/edit.vue'), 
				props: true
			},
		

//reply routes
			{
				path: '/reply/:fieldName?/:fieldValue?',
				name: 'replylist',
				component: () => import('./pages/reply/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/reply/view/:id', 
				name: 'replyview', 
				component: () => import('./pages/reply/view.vue'), 
				props: true
			},
		
			{ 
				path: '/reply/add', 
				name: 'replyadd', 
				component: () => import('./pages/reply/add.vue'), 
				props: true
			},
	
			{ 
				path: '/reply/edit/:id', 
				name: 'replyedit', 
				component: () => import('./pages/reply/edit.vue'), 
				props: true
			},
		

//roles routes
			{
				path: '/roles/:fieldName?/:fieldValue?',
				name: 'roleslist',
				component: () => import('./pages/roles/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/roles/view/:id', 
				name: 'rolesview', 
				component: () => import('./pages/roles/view.vue'), 
				props: true
			},
		
			{ 
				path: '/roles/add', 
				name: 'rolesadd', 
				component: () => import('./pages/roles/add.vue'), 
				props: true
			},
	
			{ 
				path: '/roles/edit/:id', 
				name: 'rolesedit', 
				component: () => import('./pages/roles/edit.vue'), 
				props: true
			},
		

//studentcredits routes
			{
				path: '/studentcredits/:fieldName?/:fieldValue?',
				name: 'studentcreditslist',
				component: () => import('./pages/studentcredits/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/studentcredits/view/:id', 
				name: 'studentcreditsview', 
				component: () => import('./pages/studentcredits/view.vue'), 
				props: true
			},
		
			{ 
				path: '/studentcredits/add', 
				name: 'studentcreditsadd', 
				component: () => import('./pages/studentcredits/add.vue'), 
				props: true
			},
	
			{ 
				path: '/studentcredits/edit/:id', 
				name: 'studentcreditsedit', 
				component: () => import('./pages/studentcredits/edit.vue'), 
				props: true
			},
		

//studyrecords routes
			{
				path: '/studyrecords/:fieldName?/:fieldValue?',
				name: 'studyrecordslist',
				component: () => import('./pages/studyrecords/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/studyrecords/view/:id', 
				name: 'studyrecordsview', 
				component: () => import('./pages/studyrecords/view.vue'), 
				props: true
			},
		
			{ 
				path: '/studyrecords/add', 
				name: 'studyrecordsadd', 
				component: () => import('./pages/studyrecords/add.vue'), 
				props: true
			},
	
			{ 
				path: '/studyrecords/edit/:id', 
				name: 'studyrecordsedit', 
				component: () => import('./pages/studyrecords/edit.vue'), 
				props: true
			},
		

//users routes
			{
				path: '/users/:fieldName?/:fieldValue?',
				name: 'userslist',
				component: () => import('./pages/users/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/users/view/:id', 
				name: 'usersview', 
				component: () => import('./pages/users/view.vue'), 
				props: true
			},
		
			{ 
				path: '/index/register', 
				name: 'usersuserregister', 
				component: () => import('./pages/index/userregister.vue'), 
				props: true
			},
	
			{ 
				path: '/account/edit', 
				name: 'usersaccountedit', 
				component: () => import('./pages/account/accountedit.vue'), 
				props: true
			},
	
			{ 
				path: '/account', 
				name: 'usersaccountview', 
				component: () => import('./pages/account/accountview.vue'), 
				props: true
			},
	
			{ 
				path: '/users/add', 
				name: 'usersadd', 
				component: () => import('./pages/users/add.vue'), 
				props: true
			},
	
			{ 
				path: '/users/edit/:id', 
				name: 'usersedit', 
				component: () => import('./pages/users/edit.vue'), 
				props: true
			},
		

			{ 
				path: '/teacher', 
				name: 'teacher', 
				component: () => import('././pages/custom/teacher.vue'), 
				props: true
			},
	
			{ 
				path: '/students', 
				name: 'students', 
				component: () => import('././pages/custom/students.vue'), 
				props: true
			},
	
			{ 
				path: '/admin', 
				name: 'admin', 
				component: () => import('././pages/custom/admin.vue'), 
				props: true
			},
	
	
	
//Password reset routes
			{ 
				path: '/index/forgotpassword', 
				name: 'forgotpassword', 
				component: () => import('./pages/index/forgotpassword.vue'), 
				props: true
			},
			{ 
				path: '/index/resetpassword', 
				name: 'resetpassword', 
				component: () => import('./pages/index/resetpassword.vue'), 
				props: true
			},
			{ 
				path: '/index/resetpassword_completed', 
				name: 'resetpassword_completed', 
				component: () => import('./pages/index/resetpassword_completed.vue'), 
				props: true
			},
	
	
	
	{ 
		path:  '/error/forbidden', 
		name: 'forbidden', 
		component: () => import('./pages/errors/forbidden.vue'),
		props: true
	},
	{ 
		path: '/error/notfound', 
		name: 'notfound',
		component: () => import('./pages/errors/pagenotfound.vue'),
		props: true
	},
	{
		path: '/:catchAll(.*)', 
		component: () => import('./pages/errors/pagenotfound.vue')
	}
];

export default () => {
	
const auth = useAuth();

	
	const user = auth.user;
	if(user){
		routes.push({ path: '/', alias: '/home', name: 'home', component: () => import(`./pages/home/home.vue`) });
	}
	else{
		routes.push({ path: '/', alias: '/index', name: 'index', component: () => import('./pages/index/index.vue') });
	}

	const router = createRouter({
		history: createWebHashHistory(),
		routes,
		scrollBehavior(to, from, savedPostion){
			if(savedPostion) return savedPostion;
			return { top:0 }
		}
	});
	
	router.beforeEach((to, from, next) => {
		const user = auth.user;
		let path = to.path;
		let authRequired = auth.pageRequiredAuth(path);
		if (authRequired) {
			if(!user){
				return next({ path: '/',  query: { nexturl: to.fullPath } });
			}
			//authorize user
			if (!auth.canView(path)) {
				return next({path: "/error/forbidden"});
			}
		}

		if(user && to.name == "index"){
			//already logged in, show home when try to access index page
			return next({ path: "/home"});
		}

		//navigate to redirect url if available
		if(to.name == "home" && to.query.nexturl){
			return next({ path: to.query.nexturl});
		}

 		//close dialog from previous page
		//store.closeDialogs('app/closeDialogs');
		
		next();
	});

	return router;
}
