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
                            <div class="grid ">
                                <div class="col">
                                    <!-- page records template -->
                                    <div class="page-records"  >
                                        <DataTable :lazy="true"   :loading="loading"     :value="records" dataKey="id" @sort="onSort($event)" class=" p-datatable-sm" :stripedRows ="true" :showGridlines="false" :rowHover="true" responsiveLayout="stack">
                                            <Column  field="" header="" >
                                                <template #body="{ data, index }">
                                                    <Button @click="setCurrentRecord(data)" class="p-button-text" icon="pi pi-caret-down" label="" />
                                                </template>
                                            </Column>
                                            <Column  field="course_name" :header="$t('courseName')" >
                                                <template #body="{ data, index }">
                                                    {{ data.course_name }}
                                                </template>
                                            </Column>
                                            <Column  field="course_video" :header="$t('courseVideo')" >
                                                <template #body="{ data, index }">
                                                    <video controls style="max-width: 100%; max-height: 120px; width: auto; height: auto;">  
                                                    <source :src="$utils.getFileFullPath(data.course_video)" type="video/mp4" />  
                                                    </video>
                                                </template>
                                            </Column>
                                            <Column  field="enrollment_count" :header="$t('enrollmentCount')" >
                                                <template #body="{ data, index }">
                                                    {{ data.enrollment_count }}
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
                                                <template v-if="auth.canView('courses')">
                                                    <div v-if="selectedItems.length" class="m-2">
                                                        <Button @click="deleteItem(selectedItems)" icon="pi pi-trash" class="p-button-danger" :title="$t('deleteSelected')" />
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
                                    </template>
                                    <!-- end of pagination component-->
                                </div>
                                <!-- Detal Page Column -->
                                <template v-if="currentRecord && !isSubPage">
                                    <div class="col-12">
                                        <div class="card  p-0">
                                            <component :is="masterDetailPage" :scroll-into-view="true"></component>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>
<script setup>
	import { defineAsyncComponent, computed,  toRefs, onMounted } from 'vue';
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
			default: 'COURSES-LOGINPAGELIST',
		},
		pageName: {
			type: String,
			default : 'courses',
		},
		routeName: {
			type: String,
			default: 'coursesloginpagelist',
		},
		apiPath: {
			type: String,
			default: 'courses/loginpagelist',
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
			default: false,
		},
		page: {
			type: Number,
			default: 1,
		},
		limit: {
			type: Number,
			default: 2,
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
	
	const {records, filters, currentRecord, totalRecords,  selectedItems,  pagination,} = toRefs(store.state);
	const { pageReady, loading, } = toRefs(page.state);
	
	const {  pageBreadCrumb,   totalPages, recordsPosition, } = page.computedProps;
	
	const { load,    exportPage, debounce, onSort,  deleteItem, setCurrentRecord,   } = page.methods;
	
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
	const masterDetailPage = computed(() => defineAsyncComponent(() => import("./detail-pages.vue")));
	
	onMounted(()=>{ 
		const pageTitle = $t('courses');
		app.setPageTitle(props.routeName, pageTitle);
	});
</script>
<style scoped>
</style>
