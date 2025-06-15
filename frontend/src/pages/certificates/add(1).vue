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
                        <div  class="md:col-9 sm:col-12 comp-grid" >
                            <div >
                                <form ref="observer" tag="form" @submit.prevent="submitForm()" :class="{ 'card ': !isSubPage }" class=" ">
                                    <div class="grid">
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('certificateType') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <div class="field-radiobutton" v-for="option of app.menus.certificateType" :key="option.value">
                                                        <RadioButton  :class="getErrorClass('certificate_type')" :id="option.value" name="ctrlcertificate_type" :value="option.value" v-model="formData.certificate_type" />
                                                        <label :for="option.value">{{option.label}} </label>
                                                    </div>
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
                                                    {{ $t('studentId') }} *
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <api-data-source :enable-cache="true"   api-path="components_data/student_id_option_list" >
                                                        <template v-slot="req">
                                                            <Dropdown  class="w-full" :class="getErrorClass('student_id')"   :loading="req.loading"   optionLabel="label" optionValue="value" ref="ctrlstudent_id"  v-model="formData.student_id" :options="req.response" :label="$t('studentId')"  :placeholder="$t('selectAValue')" >
                                                            </Dropdown> 
                                                            <small v-if="isFieldValid('student_id')" class="p-error">{{ getFieldError('student_id') }}</small> 
                                                        </template>
                                                    </api-data-source>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('awardDate') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <Calendar  :showButtonBar="true" :showTime="true" dateFormat="yy-mm-dd" hourFormat="24" v-model="formData.award_date" :showIcon="true" class="w-full" :class="getErrorClass('award_date')"     mask="yy-MM-DD HH:mm"     />
                                                    <small v-if="isFieldValid('award_date')" class="p-error">{{ getFieldError('award_date') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('blocknum') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlblocknum" v-model.trim="formData.blocknum"  :label="$t('blocknum')" type="number" :placeholder="$t('enterBlocknum')"   step="any"    
                                                    class=" w-full" :class="getErrorClass('blocknum')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('blocknum')" class="p-error">{{ getFieldError('blocknum') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('txHash') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrltx_hash" v-model.trim="formData.tx_hash"  :label="$t('txHash')" type="text" :placeholder="$t('enterTxHash')"      
                                                    class=" w-full" :class="getErrorClass('tx_hash')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('tx_hash')" class="p-error">{{ getFieldError('tx_hash') }}</small> 
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
				certificate_type: "", certificate_name: "", student_id: "", award_date: new Date(), blocknum: "", tx_hash: "", certificate_photo: "", 
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
			student_id: { required },
			award_date: {  },
			blocknum: { numeric },
			tx_hash: {  },
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
