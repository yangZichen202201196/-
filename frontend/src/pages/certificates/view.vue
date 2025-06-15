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
                                    {{ $t('certificateDetails') }}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </template>
            <section class="page-section " >
                <div class="container">
                    <div class="grid ">
                        <div  class="col comp-grid" >
                            <div >
                                <div class="mb-3 ">
                                    <div >
                                        <div class="">
                                            <div class="card relative shadow-lg rounded-lg overflow-hidden">
                                                <div>
                                                    <div class="flex flex-col gap-2">
                                                        <div class="flex justify-between text-h1 text-weight-bold">
                                                            <div class="font-medium" style="background-color: #e0e0e0">区块号:</div>
                                                            <div>{{ item.blocknum }}</div>
                                                        </div>
                                                        <div class="flex justify-between text-h1 text-weight-bold">
                                                            <div class="font-medium" style="background-color: #e0e0e0">哈希值:</div>
                                                            <div class="font-bold text-blue-600"  style="background-color: #ffff00">{{ item.tx_hash }}</div>
                                                        </div>
                                                        <div class="flex justify-between text-h1 text-weight-bold">
                                                            <div class="font-medium " style="background-color: #e0e0e0">时间戳:</div>
                                                            <div>{{ item.timestamp }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <NiceImage v-ripple @click="app.navigateTo(`/certificates/edit/${item.certificate_id}`)" class="cursor-pointer w-full h-64 object-cover" :src="$utils.setImgUrl(item.certificate_photo, 'large')" />
                                                <div class="bg-white p-4">
                                                    <div class="font-bold text-lg text-gray-900 text-center">{{ item.certificate_name }}</div>
                                                    <div class="text-h1 text-gray-500 text-center mt-1">{{ item.certificate_type }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- action buttons -->
                                <div  class=" flex gap-3 justify-content-start">
                                    <Menubar class="p-0 inline-menu" ref="actionMenu" :model="getActionMenuModel(item)" />
                                </div>
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
	import {   toRefs, onMounted } from 'vue';
	import { utils } from 'src/utils';
	import { useApp } from 'src/composables/app.js';
	import { useAuth } from 'src/composables/auth';
	import { $t } from 'src/services/i18n';
	import { usePageStore } from 'src/store/page';
	import { useViewPage } from 'src/composables/viewpage.js';
	const props = defineProps({
		id: [String, Number],
		primaryKey: {
			type: String,
			default: 'certificate_id',
		},
		pageStoreKey: {
			type: String,
			default: 'CERTIFICATES',
		},
		pageName: {
			type: String,
			default: 'certificates',
		},
		routeName: {
			type: String,
			default: 'certificatesview',
		},
		apiPath: {
			type: String,
			default: 'certificates/view',
		},
		autoLoad: {
			type: Boolean,
			default: true,
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
		exportButton: {
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
		isSubPage: {
			type : Boolean,
			default : false,
		}
	});
	
	const store = usePageStore(props.pageStoreKey);
	const app = useApp(props);
	const auth = useAuth();
	
	const page = useViewPage({ store, props }); // where page logics resides
	
	const {  currentRecord } = toRefs(store.state);
	const { loading, pageReady } = toRefs(page.state);
	const item = currentRecord;
	
	const  { load, deleteItem, exportPage,   } = page.methods;
	
	function getActionMenuModel(data){
		return [
		{
			label: () => $t('edit'),
			command: (event) => { app.openPageDialog({ page:'certificates/edit', url: `/certificates/edit/${data.certificate_id}`, closeBtn: true }) },
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
		const pageTitle = $t('certificateDetails');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
	
</script>
<style scoped>
</style>
