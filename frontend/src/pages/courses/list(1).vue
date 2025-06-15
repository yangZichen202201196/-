<template>
    <main class="main-page"  id="">
        <template v-if="showHeader">
            <section class="page-section mb-3" >
                <div class="container-fluid">
                    <div class="grid justify-content-between align-items-center">
                        <div  class="col " >
                            <div class=" text-2xl text-primary font-bold" >
                                {{ $t('courses') }}
                            </div>
                        </div>
                        <div  class="col-fixed " >
                            <template v-if="auth.canView('courses/add')">
                                <router-link :to="`/courses/add`">
                                    <Button :label="$t('addNewCours')" icon="pi pi-plus" type="button" class="p-button w-full bg-primary "  />
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
                                <Breadcrumb :home="{icon: 'pi pi-home', to: '/courses'}" :model="pageBreadCrumb" />
                            </template>
                            <!-- Master Page Start -->
                            <!-- page records template -->
                            <div class="page-records" >
                                <div class="grid ">
                                    <template  v-for="(data, index) of records" :key="`pagerecord-${index}`">
                                        <div class="col-12 md:col-4">
                                            <div class="card card shadow-none p-3 surface-100 ">
                                                <div class="grid align-items-center">
                                                    <div  class="col">
                                                        <div class="font-bold">{{ $t('id') }}</div>
                                                        <div class="font-bold  text-400">
                                                            <router-link :to="`/courses/view/${data.id}`">
                                                                {{ data.id }}
                                                            </router-link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr class="my-1" />
                                                <div class="grid align-items-center">
                                                    <div  class="col">
                                                        <div class="font-bold">{{ $t('courseName') }}</div>
                                                        <div class="font-bold  text-400">{{ data.course_name }}</div>
                                                    </div>
                                                </div>
                                                <hr class="my-1" />
                                                <div class="grid align-items-center">
                                                    <div  class="col">
                                                        <div class="font-bold">{{ $t('courseVideo') }}</div>
                                                        <div class="font-bold  text-400">
                                                            <video controls style="max-width: 100%; max-height: 120px; width: auto; height: auto;">  
                                                            <source :src="$utils.getFileFullPath(data.course_video)" type="video/mp4" />  
                                                        </video></div>
                                                    </div>
                                                </div>
                                                <hr class="my-1" />
                                                <div class="grid align-items-center">
                                                    <div  class="col">
                                                        <div class="font-bold">{{ $t('teacherId') }}</div>
                                                        <div class="font-bold  text-400">
                                                            <Button class="p-button-text" icon="pi pi-eye" :label="$t('users')" v-if="data.teacher_id" @click="app.openPageDialog({ page: 'users/view', url: `/users/view/${data.teacher_id}` , closeBtn: true })" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr class="my-1" />
                                                <div class="grid align-items-center">
                                                    <div  class="col">
                                                        <div class="font-bold">{{ $t('rating') }}</div>
                                                        <div class="font-bold  text-400">
                                                            <Rating v-model="data.rating" :stars="5" readonly :cancel="false" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr class="my-1" />
                                                <div class="grid align-items-center">
                                                    <div  class="col">
                                                        <div class="font-bold">{{ $t('enrollmentCount') }}</div>
                                                        <div class="font-bold  text-400">{{ data.enrollment_count }}</div>
                                                    </div>
                                                </div>
                                                <hr class="my-1" />
                                                <!-- action buttons -->
                                                <div  class=" flex gap-3 justify-content-end">
                                                    <SplitButton dropdownIcon="pi pi-bars" class="p-button dropdown-only p-button-text p-button-plain" :model="getActionMenuModel(data)">
                                                        <i></i>
                                                    </SplitButton>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <!-- Empty record -->
                            <template v-if="pageReady && !records.length">
                                <div class="p-3 my-3 text-500 text-lg font-medium text-center">
                                    {{ $t('noRecordFound') }}
                                </div>
                            </template>
                            <!-- end of empty record-->
                            <!-- pagination component-->
                            <template v-if="showFooter">
                                <div class="">
                                    <div class="grid justify-content-between align-items-center">
                                        <div class="flex gap-2 flex-grow-0">
                                            <template v-if="auth.canView('courses')">
                                                <div v-if="selectedItems.length" class="m-2">
                                                    <Button @click="deleteItem(selectedItems)" icon="pi pi-trash" class="p-button-danger" :title="$t('deleteSelected')" />
                                                </div>
                                            </template>
                                            <div class="m-2" v-if="exportButton && records.length">
                                                <Button @click="(event)=> $refs.exportMenu.toggle(event)"   :title="$t('export')" icon="pi pi-print" />
                                                <Menu ref="exportMenu" popup :model="pageExportFormats" />
                                            </div>
                                            <template v-if="auth.canView('courses')">
                                                <div class="m-2">
                                                    <import-data :label="$t('selectAFileToImport')" ref="dataimport" upload-path="courses/importdata" @importComplete="importComplete">
                                                    <Button  @click="$refs.dataimport.openDialog()" icon="pi pi-folder" :label="$t('importData')" />
                                                    </import-data>
                                                </div>
                                            </template>
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
			default : 'id',
		},
		pageStoreKey: {
			type: String,
			default: 'COURSES',
		},
		pageName: {
			type: String,
			default : 'courses',
		},
		routeName: {
			type: String,
			default: 'courseslist',
		},
		apiPath: {
			type: String,
			default: 'courses/index',
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
			default: true,
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
			default: 3,
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
	
	const { load,    exportPage, debounce, onSort,  deleteItem,   importComplete, } = page.methods;
	
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
			to: `/courses/view/${data.id}`,
			icon: "pi pi-eye",
			visible: auth.canView('courses/view')
		},
		{
			label: () => $t('edit'),
			to: `/courses/edit/${data.id}`,
			icon: "pi pi-pencil",
			visible: auth.canView('courses/edit')
		},
		{
			label: () => $t('delete'),
			command: (event) => { deleteItem(data.id) },
			icon: "pi pi-trash",
			visible: auth.canView('courses/delete')
		}
	]
	}
	
	onMounted(()=>{ 
		const pageTitle = $t('courses');
		app.setPageTitle(props.routeName, pageTitle);
	});
</script>
<style scoped>
</style>
