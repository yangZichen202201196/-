<template>
    <main class="main-page"  id="">
        <template v-if="showHeader">
            <section class="page-section mb-3" >
                <div class="container-fluid">
                    <div class="grid justify-content-between align-items-center">
                        <div  class="col " >
                            <div class=" text-2xl text-primary font-bold" >
                                {{ $t('certificates') }}
                            </div>
                        </div>
                        <div  class="col-fixed " >
                            <template v-if="auth.canView('certificates/add')">
                                <router-link :to="`/certificates/add`">
                                    <Button :label="$t('addNewCertificate')" icon="pi pi-plus" type="button" class="p-button w-full bg-primary "  />
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
                                <Breadcrumb :home="{icon: 'pi pi-home', to: '/certificates'}" :model="pageBreadCrumb" />
                            </template>
                            <!-- page records template -->
                            <div class="page-records"  >
                                <DataTable :lazy="true"   :loading="loading"    v-model:selection="selectedItems"
                                     :value="records" dataKey="certificate_id" @sort="onSort($event)" class=" p-datatable-sm" :stripedRows ="true" :showGridlines="false" :rowHover="true" responsiveLayout="stack">
                                    <Column selectionMode="multiple" headerStyle="width: 2rem" />
                                        <Column  field="certificate_id" :header="$t('certificateId')" >
                                            <template #body="{ data, index }">
                                                <router-link :to="`/certificates/view/${data.certificate_id}`">
                                                    {{ data.certificate_id }}
                                                </router-link>
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
                                        <Column  field="certificate_name" :header="$t('certificateName')" >
                                            <template #body="{ data, index }">
                                                {{ data.certificate_name }}
                                            </template>
                                        </Column>
                                        <Column  field="users_username" :header="$t('usersUsername')" >
                                            <template #body="{ data, index }">
                                                {{ data.users_username }}
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
                                            <template v-if="auth.canView('certificates')">
                                                <div v-if="selectedItems.length" class="m-2">
                                                    <Button @click="deleteItem(selectedItems)" icon="pi pi-trash" class="p-button-danger" :title="$t('deleteSelected')" />
                                                </div>
                                            </template>
                                            <div class="m-2" v-if="exportButton && records.length">
                                                <Button @click="(event)=> $refs.exportMenu.toggle(event)"   :title="$t('export')" icon="pi pi-print" />
                                                <Menu ref="exportMenu" popup :model="pageExportFormats" />
                                            </div>
                                            <template v-if="auth.canView('certificates')">
                                                <div class="m-2">
                                                    <import-data :label="$t('selectAFileToImport')" ref="dataimport" upload-path="certificates/importdata" @importComplete="importComplete">
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
                                </template>
                                <!-- end of pagination component-->
                            </div>
                        </div>
                        <div  class="col-3 comp-grid" >
                            <div :class="{ 'card ': !isSubPage }" class="p-0 mb-3">
                                <api-data-source :enable-cache="true" @loaded="(response)=> filters.certificate_type.options=response"  api-path="components_data/certificate_type_option_list" >
                                    <template v-slot="req">
                                        <div class="p-3 font-bold text-primary" >
                                            {{ $t('filterByCertificateType') }}
                                        </div>
                                        <Listbox class="w-full" v-model="filters.certificate_type.value" optionLabel="label" optionValue="value" :options="filters.certificate_type.options" >
                                            </Listbox>
                                            <div v-if="req.loading"><ProgressBar mode="indeterminate" style="height: 2px"></ProgressBar></div>
                                        </template>
                                    </api-data-source>
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
			default : 'certificate_id',
		},
		pageStoreKey: {
			type: String,
			default: 'CERTIFICATES',
		},
		pageName: {
			type: String,
			default : 'certificates',
		},
		routeName: {
			type: String,
			default: 'certificateslist',
		},
		apiPath: {
			type: String,
			default: 'certificates/index',
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
			},certificate_type: {
				tag: "Certificate Type",
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
			to: `/certificates/view/${data.certificate_id}`,
			icon: "pi pi-eye",
			visible: auth.canView('certificates/view')
		},
		{
			label: () => $t('edit'),
			to: `/certificates/edit/${data.certificate_id}`,
			icon: "pi pi-pencil",
			visible: auth.canManage('certificates/edit', data.student_id)
		},
		{
			label: () => $t('delete'),
			command: (event) => { deleteItem(data.certificate_id) },
			icon: "pi pi-trash",
			visible: auth.canManage('certificates/delete', data.student_id)
		}
	]
	}
	
	onMounted(()=>{ 
		const pageTitle = $t('certificates');
		app.setPageTitle(props.routeName, pageTitle);
	});
</script>
<style scoped>
</style>
