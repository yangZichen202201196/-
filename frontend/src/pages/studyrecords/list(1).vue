<template>
    <main class="main-page"  id="">
        <template v-if="showHeader">
            <section class="page-section mb-3" >
                <div class="container-fluid">
                    <div class="grid justify-content-between align-items-center">
                        <div  class="col " >
                            <div class=" text-2xl text-primary font-bold" >
                                {{ $t('studyRecords') }}
                            </div>
                        </div>
                        <div  class="col-fixed " >
                            <template v-if="auth.canView('studyrecords/add')">
                                <router-link :to="`/studyrecords/add`">
                                    <Button :label="$t('addNewStudyRecord')" icon="pi pi-plus" type="button" class="p-button w-full bg-primary "  />
                                </router-link>
                            </template>
                        </div>
                        <div  class="col-12 md:col-3 " >
                            <span class="p-input-icon-left w-full">
                            <i class="pi pi-search" />
                            <InputText  :placeholder="$t('search')" class="w-full" :value="filters.search.value" @input="debounce(() => { filters.search.value = $event.target.value })"  />
                            </span>
                        </div>
                        
                    </div>
                </div>
            </section>
        </template>
        <section class="page-section " >
            <div class="container-fluid">
                <div class="grid ">
                    <div  class="col comp-grid" >
                        <div class="flex align-items-center">
                            <filter-tags :controller="page.filterController" />
                        </div>
                        <div >
                            <template v-if="showBreadcrumbs && $route.query.tag && !isSubPage">
                                <Breadcrumb :home="{icon: 'pi pi-home', to: '/studyrecords'}" :model="pageBreadCrumb" />
                            </template>
                            <!-- page records template -->
                            <div class="page-records"  >
                                <DataTable :lazy="true"   :loading="loading"    v-model:selection="selectedItems"
                                     :value="records" dataKey="record_id" @sort="onSort($event)" class=" p-datatable-sm" :stripedRows ="true" :showGridlines="false" :rowHover="true" responsiveLayout="stack">
                                    <Column selectionMode="multiple" headerStyle="width: 2rem" />
                                        <Column  field="record_id" :header="$t('recordId')" >
                                            <template #body="{ data, index }">
                                                <router-link :to="`/studyrecords/view/${data.record_id}`">
                                                    {{ data.record_id }}
                                                </router-link>
                                            </template>
                                        </Column>
                                        <Column  field="userid" :header="$t('userid')" >
                                            <template #body="{ data, index }">
                                                <Button class="p-button-text" icon="pi pi-eye" :label="$t('users')" v-if="data.userid" @click="app.openPageDialog({ page: 'users/view', url: `/users/view/${data.userid}` , closeBtn: true })" />
                                            </template>
                                        </Column>
                                        <Column  field="course_id" :header="$t('courseId')" >
                                            <template #body="{ data, index }">
                                                <Button class="p-button-text" icon="pi pi-eye" :label="$t('courses')" v-if="data.course_id" @click="app.openPageDialog({ page: 'courses/view', url: `/courses/view/${data.course_id}` , closeBtn: true })" />
                                            </template>
                                        </Column>
                                        <Column  field="progress" :header="$t('progress')" >
                                            <template #body="{ data, index }">
                                                <!-- <ProgressBar size="17px" :value="$utils.toPercent(data.progress, 100)" color="accent" v-tooltip="{value: data.progress}">
                                                {{  $utils.toPercent(data.progress, 100) + '%'}}
                                                </ProgressBar> -->
                                                <Knob :size="60" readonly v-model="data.progress" :min="0" :max="100" />
                                            </template>
                                        </Column>
                                        <Column  field="study_date" :header="$t('studyDate')" >
                                            <template #body="{ data, index }">
                                                {{$utils.humanDate( data.study_date )}}
                                            </template>
                                        </Column>
                                        <Column  field="study_duration" :header="$t('studyDuration')" >
                                            <template #body="{ data, index }">
                                                {{ data.study_duration }}
                                            </template>
                                        </Column>
                                        <Column  headerStyle="width: 2rem" headerClass="text-center">
                                            <template #body="{ data, index }">
                                                <div class="flex justify-content-end">
                                                    <SplitButton dropdownIcon="pi pi-bars" class="p-button dropdown-only p-button-text p-button-plain" :model="getActionMenuModel(data)">
                                                        <i></i>
                                                    </SplitButton>
                                                </div>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                                <!-- Empty record -->
                                <template v-if="pageReady && !records.length">
                                    <div class="p-3 my-3 text-500 text-lg font-medium text-center">
                                        {{ $t('noRecordFound') }}
                                    </div>
                                </template>
                                <!-- end of empty record-->
                                <!-- pagination component-->
                                <template v-if="showFooter && pageReady">
                                    <div class="grid justify-content-between align-items-center">
                                        <div class="flex gap-2 flex-grow-0">
                                            <template v-if="auth.canView('studyrecords')">
                                                <div v-if="selectedItems.length" class="m-2">
                                                    <Button @click="deleteItem(selectedItems)" icon="pi pi-trash" class="p-button-danger" :title="$t('deleteSelected')" />
                                                </div>
                                            </template>
                                            <div class="m-2" v-if="exportButton && records.length">
                                                <Button @click="(event)=> $refs.exportMenu.toggle(event)"   :title="$t('export')" icon="pi pi-print" />
                                                <Menu ref="exportMenu" popup :model="pageExportFormats" />
                                            </div>
                                        </div>
                                        <div v-if="paginate && totalPages > 1" class="flex-grow-1">
                                            <Paginator class="paginator-flat my-3" :first="recordsPosition - 1" @page="(event)=>{pagination.page = event.page + 1}" :rows="pagination.limit" :totalRecords="totalRecords">
                                                <template #start>
                                                    <span class="px-2">
                                                    {{ $t('records') }} <b>{{ recordsPosition }} {{ $t('of') }} {{ totalRecords }}</b>
                                                    </span>
                                                </template>
                                                <template #end>
                                                </template>
                                            </Paginator>
                                        </div>
                                    </div>
                                </template>
                                <!-- end of pagination component-->
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
</template>
<script setup>
	import {   toRefs, onMounted } from 'vue';
	import { usePageStore } from 'src/store/page';
	import { utils } from 'src/utils';
	import { useApp } from 'src/composables/app.js';
	import { useAuth } from 'src/composables/auth';
	import { $t } from 'src/services/i18n';
	import { useListPage } from 'src/composables/listpage.js';
	
	const props = defineProps({
		primaryKey : {
			type : String,
			default : 'record_id',
		},
		pageStoreKey: {
			type: String,
			default: 'STUDYRECORDS',
		},
		pageName: {
			type: String,
			default : 'studyrecords',
		},
		routeName: {
			type: String,
			default: 'studyrecordslist',
		},
		apiPath: {
			type: String,
			default: 'studyrecords/index',
		},
		autoLoad: {
			type: Boolean,
			default: true,
		},
		enableCache: {
			type: Boolean,
			default: false,
		},
		paginate: {
			type: Boolean,
			default: true,
		},
		showHeader: {
			type: Boolean,
			default: true,
		},
		showFooter: {
			type: Boolean,
			default: true,
		},
		showBreadcrumbs: {
			type: Boolean,
			default: true,
		},
		exportButton: {
			type: Boolean,
			default: true,
		},
		importButton: {
			type: Boolean,
			default: false,
		},
		multiCheckbox: {
			type: Boolean,
			default: true,
		},
		page: {
			type: Number,
			default: 1,
		},
		limit: {
			type: Number,
			default: 5,
		},
		mergeRecords: { // for infinite loading
			type: Boolean,
			default: false,
		},
		search: {
			type: String,
			default: '',
		},
		fieldName: null,
		fieldValue: null,
		queryParams: { 
			type: Object,
			default: () => ({})
		},
		sortBy: {
			type: String,
			default: '',
		},
		sortType: {
			type: String,
			default: 'desc', //desc or asc
		},
		isSubPage: {
			type: Boolean,
			default: false,
		},
		emptyRecordMsg: {
			type: String,
			default: () => $t('noRecordFound'),
		},
		titleBeforeDelete: {
			type: String,
			default: $t('deleteRecord'),
		},
		msgBeforeDelete: {
			type: String,
			default: () => $t('promptDeleteRecord'),
		},
		msgAfterDelete: {
			type: String,
			default: () => $t('recordDeletedSuccessfully'),
		},
		filterTagClass: {
			type: String,
			default: 'surface-card p-2 text-500 flex-grow-1 text-center m-1 mb-3 flex-grow-1 text-center',
		}
	});
	
	const app = useApp();
	const auth = useAuth();
	
	const defaultStoreState = {
		filters: {
			search: {
				tag: "Search",
				value: '',
				valueType: 'single',
				options: [],
			}
		},
		pagination: {
			page: props.page,
			limit: props.limit,
			sortBy: props.sortBy,
			sortType: props.sortType
		},
		primaryKey: props.primaryKey,
		enableCache: props.enableCache
	}
	const store = usePageStore(props.pageStoreKey,  defaultStoreState);
	
	// page hooks where logics resides
	const page = useListPage({ store, props });
	
	const {records, filters,  totalRecords,  selectedItems,  pagination,} = toRefs(store.state);
	const { pageReady, loading, } = toRefs(page.state);
	
	const {  pageBreadCrumb,   totalPages, recordsPosition, } = page.computedProps;
	
	const { load,    exportPage, debounce, onSort,  deleteItem,    } = page.methods;
	
	const pageExportFormats =  [
		{
			label: 'Print',
			icon: 'pi pi-print text-blue-500',
			command: () => { exportPage('print') }
		},
		{
			label: 'Pdf',
			icon: 'pi pi-file-pdf text-pink-500',
			command: () => { exportPage('pdf') }
		},
		{
			label: 'Excel',
			icon: 'pi pi-file-excel text-green-500',
			command: () => { exportPage('excel') }
		},
		{
			label: 'Csv',
			icon: 'pi pi-table text-green-200',
			command: () => { exportPage('csv') }
		}
	];
	function getActionMenuModel(data){
		return [
		{
			label: () => $t('view'),
			to: `/studyrecords/view/${data.record_id}`,
			icon: "pi pi-eye",
			visible: auth.canView('studyrecords/view')
		},
		{
			label: () => $t('edit'),
			to: `/studyrecords/edit/${data.record_id}`,
			icon: "pi pi-pencil",
			visible: auth.canView('studyrecords/edit')
		},
		{
			label: () => $t('delete'),
			command: (event) => { deleteItem(data.record_id) },
			icon: "pi pi-trash",
			visible: auth.canView('studyrecords/delete')
		}
	]
	}
	
	onMounted(()=>{ 
		const pageTitle = $t('studyRecords');
		app.setPageTitle(props.routeName, pageTitle);
	});
</script>
<style scoped>
</style>
