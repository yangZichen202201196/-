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
                                    {{ $t('addNewCertificate') }}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </template>
            <section class="page-section " >
                <div class="container">
                    <div class="grid ">
                        <div  class="col-12 comp-grid" >
                            <div >
                                <form ref="observer" tag="form" @submit.prevent="submitForm()" :class="{ 'card ': !isSubPage }" class=" ">
                                    <div class="grid">
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('certificateType') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlcertificate_type" v-model.trim="formData.certificate_type"  :label="$t('certificateType')" type="text" :placeholder="$t('enterCertificateType')"   list="certificate_type_list"    
                                                    class=" w-full" :class="getErrorClass('certificate_type')">
                                                    </InputText>
                                                    <datalist id="certificate_type_list">
                                                    <option v-for="(menu, index) in app.menus.certificateType" :key="index" :value="menu.value">{{ menu.label }}</option>
                                                    </datalist>
                                                    <small v-if="isFieldValid('certificate_type')" class="p-error">{{ getFieldError('certificate_type') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('certificateName') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlcertificate_name" v-model.trim="formData.certificate_name"  :label="$t('certificateName')" type="text" :placeholder="$t('enterCertificateName')"      
                                                    class=" w-full" :class="getErrorClass('certificate_name')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('certificate_name')" class="p-error">{{ getFieldError('certificate_name') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('certificatePhoto') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <div class="mb-3">
                                                        <Uploader @uploadError="(msg)=>app.flashMsg('File Upload', msg, 'error')" :class="getErrorClass('certificate_photo')" upload-path="fileuploader/upload/certificate_photo" v-model="formData.certificate_photo" :fileLimit="1" :maxFileSize="3000000" accept=".jpg,.png,.gif,.jpeg" :multiple="false" :label="$t('chooseFilesOrDropFilesHere')" />
                                                    </div>
                                                    <small v-if="isFieldValid('certificate_photo')" class="p-error">{{ getFieldError('certificate_photo') }}</small> 
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
                        <div  class="col-12 comp-grid" >
                            <div class="">
                                <div class="card my-3 p-3 surface-50">
                                    <CoursegradesListPage ref="coursegradesListPage"  :limit="10" :show-header="true" :show-breadcrumbs="true" :show-footer="true" :paginate="true" page-store-key="USERS_ACCOUNTVIEW-COURSEGRADES" is-sub-page>
                                    </CoursegradesListPage>
                                </div>
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
	import { required } from 'src/services/validators';
	import { useApp } from 'src/composables/app.js';
	import { $t } from 'src/services/i18n';
	import { useAddPage } from 'src/composables/addpage.js';
	import { usePageStore } from 'src/store/page';
	import CoursegradesListPage from "../coursegrades/list.vue";
	const props = defineProps({
		pageStoreKey: {
			type: String,
			default: 'CERTIFICATES',
		},
		pageName : {
			type : String,
			default : 'certificates',
		},
		routeName : {
			type : String,
			default : 'certificatesadd',
		},
		apiPath : {
			type : String,
			default : 'certificates/add',
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
				certificate_type: "", certificate_name: "", certificate_photo: "", 
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
			certificate_type: {  },
			certificate_name: {  },
			certificate_photo: {  }
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
			app.navigateTo(`/certificates`);
		}
	}
	
	const {  saving, pageReady, } = toRefs(page.state);
	
	const { submitForm, getErrorClass, getFieldError, isFieldValid,  } = page.methods;
	
	onMounted(()=>{
		const pageTitle = $t('addNewCertificate');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
	
	// expose page object for other components access
	defineExpose({
		page
	});
</script>
<style scoped>
</style>
