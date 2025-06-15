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
                                    {{ $t('coursDetails') }}
                                </div>
                                <div class="">
                                    <div style="display: flex; align-items: center; gap: 10px; font-family: Arial, sans-serif;">
                                        <button 
                                        v-on:click="collent" 
                                        :style="{
                                        backgroundColor: isCollent ? '#f44336' : '#4caf50',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                        }"
                                        >
                                        {{ isCollent ? 'UnCollent' : 'Collent' }}
                                        </button>
                                        <button 
                                        v-on:click="like" 
                                        :style="{
                                        backgroundColor: isLiked ? '#f44336' : '#2196f3',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                        }"
                                        >
                                        {{ isLiked ? 'Unlike' : 'Like' }}
                                        </button>
                                        <span style="margin-left: 10px;">|{{ props.id }}| {{ likecounter }}</span>
                                    </div>
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
                            <div class="">
                                <div class="comment-box">
                                    <h3>发表评论：</h3>
                                    <textarea v-model="replay_content" placeholder="请输入评论..." style="width: 50%; height: 100px; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
                                    <button v-on:click="submitComment" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">提交评论</button>
                                </div>
                            </div>
                            <div >
                                <div class="grid ">
                                    <div class="col">
                                        <div class="mb-3 grid ">
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('id') }}</div>
                                                        <div class="font-bold">{{ item.id }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('courseName') }}</div>
                                                        <div class="font-bold">{{ item.course_name }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('courseVideo') }}</div>
                                                        <div class="font-bold">
                                                            <video controls width="560px" height="315px"> 
                                                            <source :src="item.course_video" />
                                                            </video>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('teacherId') }}</div>
                                                        <div class="font-bold">
                                                            <Button class="p-button-text" icon="pi pi-eye" :label="$t('usersDetail')" v-if="item.teacher_id" @click="app.openPageDialog({ page: 'users/view', url: `/users/view/${item.teacher_id}` , closeBtn: true })" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('rating') }}</div>
                                                        <div class="font-bold">
                                                            <Rating v-model="item.rating" :stars="5" readonly :cancel="false" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('enrollmentCount') }}</div>
                                                        <div class="font-bold">{{ item.enrollment_count }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('usersUserid') }}</div>
                                                        <div class="font-bold">{{ item.users_userid }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('usersUsername') }}</div>
                                                        <div class="font-bold">{{ item.users_username }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('usersUserpwd') }}</div>
                                                        <div class="font-bold">{{ item.users_userpwd }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('usersUseremail') }}</div>
                                                        <div class="font-bold">{{ item.users_useremail }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('usersUsertele') }}</div>
                                                        <div class="font-bold">{{ item.users_usertele }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('usersUserphoto') }}</div>
                                                        <div class="font-bold">
                                                            <image-viewer image-size="medium" image-preview-size="" :src="item.users_userphoto" width="auto" height="auto" class="img-fluid" :num-display="1">
                                                            </image-viewer>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-12 md:col-4">
                                                <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                    <div class="">
                                                        <div class="text-400 mb-1">{{ $t('usersUserRoleId') }}</div>
                                                        <div class="font-bold">
                                                            <Button class="p-button-text" icon="pi pi-eye" :label="$t('rolesDetail')" v-if="item.users_user_role_id" @click="app.openPageDialog({ page: 'roles/view', url: `/roles/view/${item.user_role_id}` , closeBtn: true })" />
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
                                    <!-- Detal Page Column -->
                                    <template v-if="currentRecord && !isSubPage">
                                        <div class="col-12">
                                            <div class="card  my-3 p-1">
                                                <component :is="masterDetailPage" :scroll-into-view="false"></component>
                                            </div>
                                        </div>
                                    </template>
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
	import { defineAsyncComponent, computed, ref, toRefs, onMounted } from 'vue';
	import { ApiService } from 'src/services/api';
	import { useApp } from 'src/composables/app.js';
	import { useAuth } from 'src/composables/auth';
	import { $t } from 'src/services/i18n';
	import { usePageStore } from 'src/store/page';
	import { useViewPage } from 'src/composables/viewpage.js';
	const props = defineProps({
		id: [String, Number],
		primaryKey: {
			type: String,
			default: 'id',
		},
		pageStoreKey: {
			type: String,
			default: 'COURSES',
		},
		pageName: {
			type: String,
			default: 'courses',
		},
		routeName: {
			type: String,
			default: 'coursesview',
		},
		apiPath: {
			type: String,
			default: 'courses/view',
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
			command: (event) => { app.openPageDialog({ page:'courses/edit', url: `/courses/edit/${data.id}`, closeBtn: true }) },
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
		const pageTitle = $t('coursDetails');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
	
	//dainzan 
const isLiked = ref(false);  
const likecounter = ref(0); 
let likeid = 0;  
onMounted(() => {
    getLikeCount(props.id);
});
const like = async () => { 
    isLiked.value = !isLiked.value;
    await postLike();
    await getLikeCount(props.id);
};
async function postLike() {  
    try {
        let postData = {
            id: props.id,
            userid: auth.userId,
        };
        if (isLiked.value) {
            if (likeid === 0) {
                let response = await ApiService.post("likes/add", postData);
                likeid = response.data.like_id; 
                console.log("Like successful:", response);
                alert("点赞成功");
            }
            } else {
            if (likeid !== 0) {
                let response = await ApiService.get(`likes/delete/${likeid}`);
                alert("已取消点赞");
                likeid = 0; 
            }
        }
        } catch (e) {
        console.error(e);
        alert("操作失败，请稍后再试");
    }
}
async function getLikeCount(id) {
    try {
        const response = await ApiService.get(`likes/getcount/${id}`);
        console.log("Response:", response);        
        if (response.data && response.data[0]) {
            console.log("===getLikeCount():", response.data[0].likecount);
            likecounter.value = response.data[0].likecount;  
            } else {
            console.error("Unexpected response format:", response);
        }
        } catch (error) {
        console.error("操作失败：", e.response || e.message);
    }
}
/////////////////////////////////////////////////////////////////////////////
//shouchang 
const isCollent = ref(false); 
const collentcounter = ref(0); 
let collentid = 0;  
const collent = async () => { 
    isCollent.value = !isCollent.value;
    await postCollent();
};
async function postCollent() {
    try {
        let postData = {
            id: props.id,
            userid: auth.userId,
        };       
        if (isCollent.value) {
            let response = await ApiService.post("collents/add", postData);
            collentid = response.data.collent_id; 
            console.log("收藏成功：", response.data);
            alert("收藏成功");
            } else {
            if (collentid !== 0) {
                let response = await ApiService.get(`collents/delete/${collentid}`);
                alert("已取消收藏");
                collentid = 0; 
            }
        }
        } catch (e) {
        console.error("操作失败：", e.response || e.message);
        alert("操作失败，请稍后再试");
    }
}
///////////////////////pinglun///////////////////////
const replay_content = ref('');  
async function submitComment() {
    if (!replay_content.value.trim()) {
        app.flashMsg('错误', '评论内容不能为空', 'error');
        return;
    }  
    await addcomment(replay_content.value);
}
async function addcomment(replay_content) {
    try {        
        const id = props.id; 
        const username = auth.userName;                 
        const postData = {
            id: id,
            username: username,
            replay_content: replay_content,
        };                     
        const response = await ApiService.post("reply/add", postData);
        console.log("==========================", response.data)
        if (response.data.reply_id) {            
            app.flashMsg('成功', '评论已提交', 'success');
            alert("评论成功")
            } else {
            app.flashMsg('错误', '评论提交失败', 'error');
            alert("评论失败")
        }
        } catch (e) {
        console.error(e);
        app.flashMsg('错误', '提交评论时出错', 'error');
    }
}
</script>
<style scoped>
</style>
