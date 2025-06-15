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
                                    {{ $t('editCourseGrade') }}
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
                                                    {{ $t('usualScore') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlusual_score" v-model.trim="formData.usual_score"  :label="$t('usualScore')" type="number" :placeholder="$t('enterUsualScore')"   step="any"    
                                                    class=" w-full" :class="getErrorClass('usual_score')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('usual_score')" class="p-error">{{ getFieldError('usual_score') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('examScore') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlexam_score" v-model.trim="formData.exam_score"  :label="$t('examScore')" type="number" :placeholder="$t('enterExamScore')"   step="any"    
                                                    class=" w-full" :class="getErrorClass('exam_score')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('exam_score')" class="p-error">{{ getFieldError('exam_score') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('totalScore') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrltotal_score" v-model.trim="formData.total_score"  :label="$t('totalScore')" type="number" :placeholder="$t('enterTotalScore')"   step="any"    
                                                    class=" w-full" :class="getErrorClass('total_score')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('total_score')" class="p-error">{{ getFieldError('total_score') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('credit') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlcredit" v-model.trim="formData.credit"  :label="$t('credit')" type="number" :placeholder="$t('enterCredit')"   step="any"    
                                                    class=" w-full" :class="getErrorClass('credit')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('credit')" class="p-error">{{ getFieldError('credit') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('blocknum') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlblocknum" v-model.trim="formData.blocknum"  :label="$t('blocknum')" type="text" :placeholder="$t('enterBlocknum')"      
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
                                                    {{ $t('timestamp') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <Calendar  :showButtonBar="true" class="w-full" :class="getErrorClass('timestamp')" v-model="formData.timestamp"     :showTime="true" :timeOnly="true"      />
                                                    <small v-if="isFieldValid('timestamp')" class="p-error">{{ getFieldError('timestamp') }}</small> 
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
			default: 'COURSEGRADES',
		},
		pageName: {
			type: String,
			default: 'coursegrades',
		},
		routeName: {
			type: String,
			default: 'coursegradesedit',
		},
		pagePath: {
			type : String,
			default : 'coursegrades/edit',
		},
		apiPath: {
			type: String,
			default: 'coursegrades/edit',
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
		student_id: "", course_id: "", usual_score: "0", exam_score: "0", total_score: "", credit: "0", blocknum: "", tx_hash: "", timestamp: new Date(), 
	}, props.pageData);
	
	const formData = reactive({ ...formDefaultValues });
	
	function afterSubmit(response) {
		app.flashMsg(props.msgTitle, props.msgAfterSave);
		if(app.isDialogOpen()){
			app.closeDialogs(); // if page is open as dialog, close dialog
		}
		else if(props.redirect) {
			app.navigateTo(`/coursegrades`);
		}
	}
	
	// form validation rules
	const rules = computed(() => {
		return {
			student_id: { required },
			course_id: { required },
			usual_score: { numeric },
			exam_score: { numeric },
			total_score: { numeric },
			credit: { numeric },
			blocknum: {  },
			tx_hash: {  },
			timestamp: {  }
		}
	});
	
	const page = useEditPage({store, props, formData, rules, afterSubmit });
	
	const {  currentRecord: editRecord } = toRefs(store.state);
	const {  pageReady, saving, loading, } = toRefs(page.state);
	
	const { apiUrl } = page.computedProps;
	
	const { load, submitForm, getErrorClass, getFieldError, isFieldValid,  } = page.methods;
	
	onMounted(()=>{
		const pageTitle = $t('editCourseGrade');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
</script>
<style scoped>
</style>
