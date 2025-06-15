<template>
    <main class="main-page"  id="">
        <template v-if="pageReady">
            <template v-if="showHeader">
                <section class="page-section mb-3" >
                    <div class="container">
                        <div class="grid justify-content-between align-items-center">
                            <div  v-if="!isSubPage"  class="col-fixed " >
                                <Button @click="$router.go(-1)"   class="p-button p-button-text " icon="pi pi-arrow-left"  />
                            </div>
                            <div  class="col " >
                                <div class=" text-2xl text-primary font-bold" >
                                    {{ $t('addNewCours') }}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </template>
            <section class="page-section " >
                <div class="container">
                    <div class="grid ">
                        <div  class="md:col-9 sm:col-12 comp-grid" >
                            <div >
                                <form ref="observer" tag="form" @submit.prevent="submitForm()" :class="{ 'card ': !isSubPage }" class=" ">
                                    <div class="grid">
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('courseName') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlcourse_name" v-model.trim="formData.course_name"  :label="$t('courseName')" type="text" :placeholder="$t('enterCourseName')"      
                                                    class=" w-full" :class="getErrorClass('course_name')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('course_name')" class="p-error">{{ getFieldError('course_name') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('courseVideo') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <div class="mb-3">
                                                        <Uploader @uploadError="(msg)=>app.flashMsg('File Upload', msg, 'error')" :class="getErrorClass('course_video')" upload-path="fileuploader/upload/course_video" v-model="formData.course_video" :fileLimit="1" :maxFileSize="10000000" accept=".mp3,.mp4,.webm,.wav,.avi,.mpg,.mpeg" :multiple="false" :label="$t('chooseFilesOrDropFilesHere')" />
                                                    </div>
                                                    <small v-if="isFieldValid('course_video')" class="p-error">{{ getFieldError('course_video') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('teacherId') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlteacher_id" v-model.trim="formData.teacher_id"  :label="$t('teacherId')" type="number" :placeholder="$t('enterTeacherId')"   step="any" list="teacher_id_list"    
                                                    class=" w-full" :class="getErrorClass('teacher_id')">
                                                    </InputText>
                                                    <api-data-source :enable-cache="true"   api-path="components_data/student_id_option_list" >
                                                        <template v-slot="req">
                                                            <datalist id="teacher_id_list">
                                                            <option v-for="(menu, index) in req.response" :key="index" :value="menu.value">{{ menu.label }}</option>
                                                            </datalist>
                                                        </template>
                                                    </api-data-source>
                                                    <small v-if="isFieldValid('teacher_id')" class="p-error">{{ getFieldError('teacher_id') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('rating') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlrating" v-model.trim="formData.rating"  :label="$t('rating')" type="number" :placeholder="$t('enterRating')"   step="0.1"    
                                                    class=" w-full" :class="getErrorClass('rating')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('rating')" class="p-error">{{ getFieldError('rating') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('enrollmentCount') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlenrollment_count" v-model.trim="formData.enrollment_count"  :label="$t('enrollmentCount')" type="number" :placeholder="$t('enterEnrollmentCount')"   step="any"    
                                                    class=" w-full" :class="getErrorClass('enrollment_count')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('enrollment_count')" class="p-error">{{ getFieldError('enrollment_count') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="showSubmitButton" class="text-center my-3">
                                        <Button class="p-button-primary" type="submit" :label="$t('submit')" icon="pi pi-send" :loading="saving" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </template>
    </main>
</template>
<script setup>
	import {  computed,  reactive, toRefs, onMounted } from 'vue';
	import { required, numeric, } from 'src/services/validators';
	import { useApp } from 'src/composables/app.js';
	import { $t } from 'src/services/i18n';
	import { useAddPage } from 'src/composables/addpage.js';
	import { usePageStore } from 'src/store/page';
	const props = defineProps({
		pageStoreKey: {
			type: String,
			default: 'COURSES',
		},
		pageName : {
			type : String,
			default : 'courses',
		},
		routeName : {
			type : String,
			default : 'coursesadd',
		},
		apiPath : {
			type : String,
			default : 'courses/add',
		},
		submitButtonLabel: {
			type: String,
			default: () => $t('submit'),
		},
		formValidationError: {
			type: String,
			default: $t('formIsInvalid'),
		},
		formValidationMsg: {
			type: String,
			default: $t('pleaseCompleteTheForm'),
		},
		msgTitle: {
			type: String,
			default: $t('createRecord'),
		},
		msgAfterSave: {
			type: String,
			default: () => $t('recordAddedSuccessfully'),
		},
		msgBeforeSave: {
			type: String,
			default: () => $t(''),
		},
		showHeader: {
			type: Boolean,
			default: true,
		},
		showSubmitButton: {
			type: Boolean,
			default: true,
		},
		redirect: {
			type : Boolean,
			default : true,
		},
		isSubPage: {
			type : Boolean,
			default : false,
		},
		pageData: { // use to set formData default values from another page
			type: Object,
			default: () => ({
				course_name: "", course_video: "", teacher_id: "", rating: "", enrollment_count: "0", 
			})
		},
	});
	//lines
	const store = usePageStore(props.pageStoreKey);
	const app = useApp();
	
	const formData = reactive({ ...props.pageData });
	
	//vuelidate form validation rules
	const rules = computed(() => {
		return {
			course_name: {  },
			course_video: {  },
			teacher_id: { numeric },
			rating: { numeric },
			enrollment_count: { numeric }
		}
	});
	
	const page = useAddPage({ store, props, formData, rules, beforeSubmit, afterSubmit });
	
	// event raised before submit form
	function beforeSubmit(){
		return true;
	}
	
	// event raised after form submited
	function afterSubmit(response) { 
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		page.setFormDefaultValues(); //reset form data
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigateTo(`/courses`);
		}
	}
	
	const {  saving, pageReady, } = toRefs(page.state);
	
	const { submitForm, getErrorClass, getFieldError, isFieldValid,  } = page.methods;
	
	onMounted(()=>{
		const pageTitle = $t('addNewCours');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
	
	// expose page object for other components access
	defineExpose({
		page
	});
</script>
<style scoped>
</style>
