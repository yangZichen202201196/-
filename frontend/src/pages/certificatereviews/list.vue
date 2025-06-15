<template>
    <main class="main-page"  id="">
        <template v-if="showHeader">
            <section class="page-section mb-3" >
                <div class="container-fluid">
                    <div class="grid justify-content-between align-items-center">
                        <div  class="col " >
                            <div class=" text-2xl text-primary font-bold" >
                                {{ $t('certificateReviews') }}
                            </div>
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
                                <Breadcrumb :home="{icon: 'pi pi-home', to: '/certificatereviews'}" :model="pageBreadCrumb" />
                            </template>
                            <!-- page records template -->
                            <div class="page-records"  >
                                <DataTable :lazy="true"   :loading="loading"    v-model:selection="selectedItems"
                                     :value="records" dataKey="review_id" @sort="onSort($event)" class=" p-datatable-sm" :stripedRows ="true" :showGridlines="false" :rowHover="true" responsiveLayout="stack">
                                    <Column selectionMode="multiple" headerStyle="width: 2rem" />
                                        <Column  field="review_id" :header="$t('reviewId')" >
                                            <template #body="{ data, index }">
                                                <router-link :to="`/certificatereviews/view/${data.review_id}`">
                                                    {{ data.review_id }}
                                                </router-link>
                                            </template>
                                        </Column>
                                        <Column  field="certificate_name" :header="$t('certificateName')" >
                                            <template #body="{ data, index }">
                                                {{ data.certificate_name }}
                                            </template>
                                        </Column>
                                        <Column  field="certificate_photo" :header="$t('certificatePhoto')" >
                                            <template #body="{ data, index }">
                                                <image-viewer image-size="small" image-preview-size="" :src="data.certificate_photo" width="50px" height="50px" class="img-fluid" :num-display="1">
                                                </image-viewer>
                                            </template>
                                        </Column>
                                        <Column  field="certificate_type" :header="$t('certificateType')" >
                                            <template #body="{ data, index }">
                                                {{ data.certificate_type }}
                                            </template>
                                        </Column>
                                        <Column  field="student_id" :header="$t('studentId')" >
                                            <template #body="{ data, index }">
                                                {{ data.student_id }}
                                            </template>
                                        </Column>
                                        <Column  field="submit_time" :header="$t('submitTime')" >
                                            <template #body="{ data, index }">
                                                {{ data.submit_time }}
                                            </template>
                                        </Column>
                                        <Column  field="review_status" :header="$t('reviewStatus')" >
                                            <template #body="{ data, index }">
                                                {{ data.review_status }}
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
                                            <template v-if="auth.canView('certificatereviews')">
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
                        </div>
                    </div>
                </div>
            </section>
        </main>
</template>
<script setup>
	import {   toRefs, onMounted } from 'vue';
	import { usePageStore } from 'src/store/page';
	import { useApp } from 'src/composables/app.js';
	import { useAuth } from 'src/composables/auth';
	import { $t } from 'src/services/i18n';
	import { useListPage } from 'src/composables/listpage.js';
	
	const props = defineProps({
		primaryKey : {
			type : String,
			default : 'review_id',
		},
		pageStoreKey: {
			type: String,
			default: 'CERTIFICATEREVIEWS',
		},
		pageName: {
			type: String,
			default : 'certificatereviews',
		},
		routeName: {
			type: String,
			default: 'certificatereviewslist',
		},
		apiPath: {
			type: String,
			default: 'certificatereviews/index',
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
			default: 10,
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
	
	function getActionMenuModel(data){
		return [
		{
			label: () => $t('view'),
			to: `/certificatereviews/view/${data.review_id}`,
			icon: "pi pi-eye",
			visible: auth.canView('certificatereviews/view')
		},
		{
			label: () => $t('edit'),
			to: `/certificatereviews/edit/${data.review_id}`,
			icon: "pi pi-pencil",
			visible: auth.canManage('certificatereviews/edit', data.student_id)
		},
		{
			label: () => $t('delete'),
			command: (event) => { deleteItem(data.review_id) },
			icon: "pi pi-trash",
			visible: auth.canManage('certificatereviews/delete', data.student_id)
		}
	]
	}
	
	onMounted(()=>{ 
		const pageTitle = $t('certificateReviews');
		app.setPageTitle(props.routeName, pageTitle);
	});
</script>
<style scoped>
</style>
