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
                                    {{ $t('addNewStudyRecord') }}
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
                                                    {{ $t('userid') }} *
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <api-data-source :enable-cache="true"   api-path="components_data/student_id_option_list" >
                                                        <template v-slot="req">
                                                            <Dropdown  class="w-full" :class="getErrorClass('userid')"   :loading="req.loading"   optionLabel="label" optionValue="value" ref="ctrluserid"  v-model="formData.userid" :options="req.response" :label="$t('userid')"  :placeholder="$t('selectAValue')" >
                                                            </Dropdown> 
                                                            <small v-if="isFieldValid('userid')" class="p-error">{{ getFieldError('userid') }}</small> 
                                                        </template>
                                                    </api-data-source>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('courseId') }} *
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <api-data-source :enable-cache="true"   api-path="components_data/id_option_list" >
                                                        <template v-slot="req">
                                                            <Dropdown  class="w-full" :class="getErrorClass('course_id')"   :loading="req.loading"   optionLabel="label" optionValue="value" ref="ctrlcourse_id"  v-model="formData.course_id" :options="req.response" :label="$t('courseId')"  :placeholder="$t('selectAValue')" >
                                                            </Dropdown> 
                                                            <small v-if="isFieldValid('course_id')" class="p-error">{{ getFieldError('course_id') }}</small> 
                                                        </template>
                                                    </api-data-source>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('progress') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlprogress" v-model.trim="formData.progress"  :label="$t('progress')" type="number" :placeholder="$t('enterProgress')"   step="0.1"    
                                                    class=" w-full" :class="getErrorClass('progress')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('progress')" class="p-error">{{ getFieldError('progress') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('studyDate') }} *
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <Calendar  :showButtonBar="true" class="w-full" :class="getErrorClass('study_date')" dateFormat="yy-mm-dd" v-model="formData.study_date" :showIcon="true"     mask="YYYY-MM-DD"      />
                                                    <small v-if="isFieldValid('study_date')" class="p-error">{{ getFieldError('study_date') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('studyDuration') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlstudy_duration" v-model.trim="formData.study_duration"  :label="$t('studyDuration')" type="number" :placeholder="$t('enterStudyDuration')"   step="any"    
                                                    class=" w-full" :class="getErrorClass('study_duration')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('study_duration')" class="p-error">{{ getFieldError('study_duration') }}</small> 
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
			default: 'STUDYRECORDS',
		},
		pageName : {
			type : String,
			default : 'studyrecords',
		},
		routeName : {
			type : String,
			default : 'studyrecordsadd',
		},
		apiPath : {
			type : String,
			default : 'studyrecords/add',
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
				userid: "", course_id: "", progress: "0.00", study_date: new Date(), study_duration: "0", 
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
			userid: { required },
			course_id: { required },
			progress: { numeric },
			study_date: { required },
			study_duration: { numeric }
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
			app.navigateTo(`/studyrecords`);
		}
	}
	
	const {  saving, pageReady, } = toRefs(page.state);
	
	const { submitForm, getErrorClass, getFieldError, isFieldValid,  } = page.methods;
	
	onMounted(()=>{
		const pageTitle = $t('addNewStudyRecord');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
	
	// expose page object for other components access
	defineExpose({
		page
	});
</script>
<style scoped>
</style>
