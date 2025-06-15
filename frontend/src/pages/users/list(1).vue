<template>
    <main class="main-page"  id="">
        <template v-if="showHeader">
            <section class="page-section mb-3" >
                <div class="container-fluid">
                    <div class="grid justify-content-between align-items-center">
                        <div  class="col " >
                            <div class=" text-2xl text-primary font-bold" >
                                {{ $t('users') }}
                            </div>
                            <div class="">
                                <div>  
                                    <button   
                                    v-on:click="getAccount"   
                                    style="background-color: #008CBA; color: white; border: none; padding: 10px 20px; cursor: pointer; transition: background-color 0.3s;"   
                                    onmouseover="this.style.backgroundColor='#005f73'"   
                                    onmouseout="this.style.backgroundColor='#008CBA'"   
                                    onmousedown="this.style.backgroundColor='#003e4f'">  
                                    getAccount  
                                    </button>  
                                    {{account}}  
                                    <button   
                                    v-on:click="getBlocknum"   
                                    style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; cursor: pointer; transition: background-color 0.3s;"   
                                    onmouseover="this.style.backgroundColor='#45a049'"   
                                    onmouseout="this.style.backgroundColor='#4CAF50'"   
                                    onmousedown="this.style.backgroundColor='#3b842d'">  
                                    getBlocknum  
                                    </button>  
                                    {{blocknum}}  
                                </div>
                            </div>
                        </div>
                        <div  class="col-fixed " >
                            <template v-if="auth.canView('users/add')">
                                <router-link :to="`/users/add`">
                                    <Button :label="$t('addNewUser')" icon="pi pi-plus" type="button" class="p-button w-full bg-primary "  />
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
                                <Breadcrumb :home="{icon: 'pi pi-home', to: '/users'}" :model="pageBreadCrumb" />
                            </template>
                            <div class="grid ">
                                <div class="col">
                                    <!-- page records template -->
                                    <div class="page-records"  >
                                        <DataTable :lazy="true"   :loading="loading"    v-model:selection="selectedItems"
                                             :value="records" dataKey="userid" @sort="onSort($event)" class=" p-datatable-sm" :stripedRows ="true" :showGridlines="false" :rowHover="true" responsiveLayout="stack">
                                            <Column selectionMode="multiple" headerStyle="width: 2rem" />
                                                <Column  field="" header="" >
                                                    <template #body="{ data, index }">
                                                        <Button @click="setCurrentRecord(data)" class="p-button-text" icon="pi pi-caret-down" label="" />
                                                    </template>
                                                </Column>
                                                <Column  field="userid" :header="$t('userid')" :sortable="true">
                                                    <template #body="{ data, index }">
                                                        <router-link :to="`/users/view/${data.userid}`">
                                                            {{ data.userid }}
                                                        </router-link>
                                                    </template>
                                                </Column>
                                                <Column  field="username" :header="$t('username')" >
                                                    <template #body="{ data, index }">
                                                        {{ data.username }}
                                                    </template>
                                                </Column>
                                                <Column  field="useremail" :header="$t('useremail')" >
                                                    <template #body="{ data, index }">
                                                        <a class="p-button-text" :href="`mailto:${data.useremail}`">
                                                            {{ data.useremail }}
                                                        </a>
                                                    </template>
                                                </Column>
                                                <Column  field="usertele" :header="$t('usertele')" >
                                                    <template #body="{ data, index }">
                                                        {{ data.usertele }}
                                                    </template>
                                                </Column>
                                                <Column  field="userphoto" :header="$t('userphoto')" >
                                                    <template #body="{ data, index }">
                                                        <image-viewer image-size="small" image-preview-size="" :src="data.userphoto" width="50px" height="50px" class="img-fluid" :num-display="1">
                                                        </image-viewer>
                                                    </template>
                                                </Column>
                                                <Column  field="user_role_id" :header="$t('userRoleId')" >
                                                    <template #body="{ data, index }">
                                                        <Button class="p-button-text" icon="pi pi-eye" :label="$t('roles')" v-if="data.user_role_id" @click="app.openPageDialog({ page: 'roles/view', url: `/roles/view/${data.user_role_id}` , closeBtn: true })" />
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
                                                    <template v-if="auth.canView('users')">
                                                        <div v-if="selectedItems.length" class="m-2">
                                                            <Button @click="deleteItem(selectedItems)" icon="pi pi-trash" class="p-button-danger" :title="$t('deleteSelected')" />
                                                        </div>
                                                    </template>
                                                    <div class="m-2" v-if="exportButton && records.length">
                                                        <Button @click="(event)=> $refs.exportMenu.toggle(event)"   :title="$t('export')" icon="pi pi-print" />
                                                        <Menu ref="exportMenu" popup :model="pageExportFormats" />
                                                    </div>
                                                    <template v-if="auth.canView('users')">
                                                        <div class="m-2">
                                                            <import-data :label="$t('selectAFileToImport')" ref="dataimport" upload-path="users/importdata" @importComplete="importComplete">
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
	import { defineAsyncComponent, computed, ref, toRefs, onMounted } from 'vue';
	import { usePageStore } from 'src/store/page';
	import { useApp } from 'src/composables/app.js';
	import { useAuth } from 'src/composables/auth';
	import { $t } from 'src/services/i18n';
	import { useListPage } from 'src/composables/listpage.js';
	import { Web3 } from 'web3';
	
	const props = defineProps({
		primaryKey : {
			type : String,
			default : 'userid',
		},
		pageStoreKey: {
			type: String,
			default: 'USERS',
		},
		pageName: {
			type: String,
			default : 'users',
		},
		routeName: {
			type: String,
			default: 'userslist',
		},
		apiPath: {
			type: String,
			default: 'users/index',
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
	
	const { load,    exportPage, debounce, onSort,  deleteItem, setCurrentRecord,  importComplete, } = page.methods;
	
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
			to: `/users/view/${data.userid}`,
			icon: "pi pi-eye",
			visible: auth.canView('users/view')
		},
		{
			label: () => $t('edit'),
			to: `/users/edit/${data.userid}`,
			icon: "pi pi-pencil",
			visible: auth.canView('users/edit')
		},
		{
			label: () => $t('delete'),
			command: (event) => { deleteItem(data.userid) },
			icon: "pi pi-trash",
			visible: auth.canView('users/delete')
		}
	]
	}
	const masterDetailPage = computed(() => defineAsyncComponent(() => import("./detail-pages.vue")));
	
	onMounted(()=>{ 
		const pageTitle = $t('users');
		app.setPageTitle(props.routeName, pageTitle);
	});
	const web3 = ref(null);
const account = ref('');
const error = ref('');
const checkMetaMaskInstalled = () => {
    if (!window.ethereum) {
        error.value = '请先安装 MetaMask 钱包';
        return false;
    }
    return true;
};
const initWeb3 = () => {
    try {
        web3.value = new Web3(window.ethereum);
        } catch (err) {
        error.value = '初始化 Web3 失败';
        console.error('Web3初始化错误:', err);
    }
};
async function getBlocknum(){
    const blocknum = await web3.value.eth.getBlockNumber();
    console.log(blocknum);
    //alert(blocknum);
}    
async function getAccount(){
    const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
    });
    console.log(accounts);
    account.value = accounts[0];
    //alert(account.value);
}
onMounted(()=>{
    if (checkMetaMaskInstalled()) {
        initWeb3();
    }
});
</script>
<style scoped>
</style>
