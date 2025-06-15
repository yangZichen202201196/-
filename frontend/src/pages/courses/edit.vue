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
                                    {{ $t('editCours') }}
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
                                <form ref="observer"  tag="form" @submit.prevent="submitForm()" :class="{ 'card ': !isSubPage }" class=" ">
                                    <!--[form-content-start]-->
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
                                                        <Uploader :class="getErrorClass('course_video')" :auto="true" :fileLimit="1" :maxFileSize="10000000" accept=".mp3,.mp4,.webm,.wav,.avi,.mpg,.mpeg" :multiple="false" style="width:100%" :label="$t('chooseFilesOrDropFilesHere')" upload-path="fileuploader/upload/course_video" v-model="formData.course_video"></Uploader>
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
                                                    <api-data-source :enable-cache="true"   api-path="components_data/userid_option_list" >
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
                                    <!--[form-content-end]-->
                                    <div v-if="showSubmitButton" class="text-center my-3">
                                        <Button type="submit" :label="$t('update')" icon="pi pi-send" :loading="saving" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </template>
        <template v-if="loading">
            <div style="min-height:200px" class="flex gap-3 justify-content-center align-items-center p-3">
                <div><ProgressSpinner style="width:50px;height:50px" /> </div>
                <div class="text-500">{{ $t('loading') }} </div>
            </div>
        </template>
    </main>
</template>
<script setup>
	import {  computed,  reactive, toRefs, onMounted } from 'vue';
	import { required, numeric, } from 'src/services/validators';
	import { useApp } from 'src/composables/app.js';
	import { $t } from 'src/services/i18n';
	import { useEditPage } from 'src/composables/editpage.js';
	import { usePageStore } from 'src/store/page';
	const props = defineProps({
		id: [String, Number],
		pageStoreKey: {
			type: String,
			default: 'COURSES',
		},
		pageName: {
			type: String,
			default: 'courses',
		},
		routeName: {
			type: String,
			default: 'coursesedit',
		},
		pagePath: {
			type : String,
			default : 'courses/edit',
		},
		apiPath: {
			type: String,
			default: 'courses/edit',
		},
		submitButtonLabel: {
			type: String,
			default: () => $t('update'),
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
			default: $t('updateRecord'),
		},
		msgBeforeSave: {
			type: String,
			default: () => $t(''),
		},
		msgAfterSave: {
			type: String,
			default: () => $t('recordUpdatedSuccessfully'),
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
	});
	
	const store = usePageStore(props.pageStoreKey);
	const app = useApp();
	
	const formDefaultValues = Object.assign({
		course_name: "", course_video: "", teacher_id: "", rating: "", enrollment_count: "0", 
	}, props.pageData);
	
	const formData = reactive({ ...formDefaultValues });
	
	function afterSubmit(response) {
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigateTo(`/courses`);
		}
	}
	
	// form validation rules
	const rules = computed(() => {
		return {
			course_name: {  },
			course_video: {  },
			teacher_id: { numeric },
			rating: { numeric },
			enrollment_count: { numeric }
		}
	});
	
	const page = useEditPage({store, props, formData, rules, afterSubmit });
	
	const {  currentRecord: editRecord } = toRefs(store.state);
	const {  pageReady, saving, loading, } = toRefs(page.state);
	
	const { apiUrl } = page.computedProps;
	
	const { load, submitForm, getErrorClass, getFieldError, isFieldValid,  } = page.methods;
	
	onMounted(()=>{
		const pageTitle = $t('editCours');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
</script>
<style scoped>
</style>
