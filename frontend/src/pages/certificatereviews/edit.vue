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
                                    {{ $t('editCertificateReview') }}
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
                                                    {{ $t('certificateName') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <api-data-source :enable-cache="true"   api-path="components_data/certificate_name_option_list" >
                                                        <template v-slot="req">
                                                            <Dropdown  class="w-full" :class="getErrorClass('certificate_name')"   :loading="req.loading"   optionLabel="label" optionValue="value" ref="ctrlcertificate_name"  v-model="formData.certificate_name" :options="req.response" :label="$t('certificateName')"  :placeholder="$t('selectAValue')" >
                                                            </Dropdown> 
                                                            <small v-if="isFieldValid('certificate_name')" class="p-error">{{ getFieldError('certificate_name') }}</small> 
                                                        </template>
                                                    </api-data-source>
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
                                                        <Uploader :class="getErrorClass('certificate_photo')" :auto="true" :fileLimit="1" :maxFileSize="3000000" accept=".jpg,.png,.gif,.jpeg" :multiple="false" style="width:100%" :label="$t('chooseFilesOrDropFilesHere')" upload-path="fileuploader/upload/certificate_photo" v-model="formData.certificate_photo"></Uploader>
                                                    </div>
                                                    <small v-if="isFieldValid('certificate_photo')" class="p-error">{{ getFieldError('certificate_photo') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('certificateType') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlcertificate_type" v-model.trim="formData.certificate_type"  :label="$t('certificateType')" type="text" :placeholder="$t('enterCertificateType')"      
                                                    class=" w-full" :class="getErrorClass('certificate_type')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('certificate_type')" class="p-error">{{ getFieldError('certificate_type') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('reviewStatus') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <Dropdown  class="w-full" :class="getErrorClass('review_status')"      optionLabel="label" optionValue="value" ref="ctrlreview_status"  v-model="formData.review_status" :options="app.menus.reviewStatus" :label="$t('reviewStatus')"  :placeholder="$t('selectAValue')" >
                                                    </Dropdown> 
                                                    <small v-if="isFieldValid('review_status')" class="p-error">{{ getFieldError('review_status') }}</small> 
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
	import { required } from 'src/services/validators';
	import { useApp } from 'src/composables/app.js';
	import { $t } from 'src/services/i18n';
	import { useEditPage } from 'src/composables/editpage.js';
	import { usePageStore } from 'src/store/page';
	const props = defineProps({
		id: [String, Number],
		pageStoreKey: {
			type: String,
			default: 'CERTIFICATEREVIEWS',
		},
		pageName: {
			type: String,
			default: 'certificatereviews',
		},
		routeName: {
			type: String,
			default: 'certificatereviewsedit',
		},
		pagePath: {
			type : String,
			default : 'certificatereviews/edit',
		},
		apiPath: {
			type: String,
			default: 'certificatereviews/edit',
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
		certificate_name: "", certificate_photo: "", certificate_type: "", review_status: "", 
	}, props.pageData);
	
	const formData = reactive({ ...formDefaultValues });
	
	function afterSubmit(response) {
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigateTo(`/certificatereviews`);
		}
	}
	
	// form validation rules
	const rules = computed(() => {
		return {
			certificate_name: {  },
			certificate_photo: {  },
			certificate_type: {  },
			review_status: {  }
		}
	});
	
	const page = useEditPage({store, props, formData, rules, afterSubmit });
	
	const {  currentRecord: editRecord } = toRefs(store.state);
	const {  pageReady, saving, loading, } = toRefs(page.state);
	
	const { apiUrl } = page.computedProps;
	
	const { load, submitForm, getErrorClass, getFieldError, isFieldValid,  } = page.methods;
	
	onMounted(()=>{
		const pageTitle = $t('editCertificateReview');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
</script>
<style scoped>
</style>
