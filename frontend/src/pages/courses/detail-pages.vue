<template>
    <div id="master-detailpage">
        <TabView v-model:activeIndex="activeTab">
            <template v-if="auth.canView('reply')">
                <TabPanel>
                    <template #header>
                        <div class=" text-lg font-bold" >
                            {{ $t('coursReply') }}
                        </div>
                    </template>
                    <div class="card my-3 p-3 surface-50">
                        <ReplyListPage ref="replyListPage"  field-name="reply.id" :field-value="masterRecord.id" :show-header="false" :show-breadcrumbs="false" isSubPage>
                        </ReplyListPage>
                    </div>
                </TabPanel>
            </template>
            <template v-if="auth.canView('coursegrades')">
                <TabPanel>
                    <template #header>
                        <div class=" text-lg font-bold" >
                            {{ $t('coursCourseGrades') }}
                        </div>
                    </template>
                    <div class="card my-3 p-3 surface-50">
                        <CoursegradesListPage ref="coursegradesListPage"  field-name="course_grades.course_id" :field-value="masterRecord.id" :show-header="false" :show-breadcrumbs="false" isSubPage>
                        </CoursegradesListPage>
                    </div>
                </TabPanel>
            </template>
        </TabView>
    </div>
</template>
<script setup>
import { watch, computed, ref, onMounted } from 'vue';
import { useApp } from 'src/composables/app.js';
import { useAuth } from 'src/composables/auth';
import { $t } from 'src/services/i18n';
import { usePageStore } from 'src/store/page';
import ReplyListPage from "../reply/list.vue";
import CoursegradesListPage from "../coursegrades/list.vue";
const props = defineProps({
	isSubPage: {
		type : Boolean,
		default : true,
	},
	scrollIntoView: {
		type : Boolean,
		default : false,
	},
});
const store = usePageStore('COURSES');
const app = useApp();
const auth = useAuth();
const masterRecord = computed(() => store.state.currentRecord);
const activeTab = ref(0);
const pageReady = computed(() => masterRecord.value != null);
//scroll detail page into view
function scrollToDetailPage() {
	if (props.scrollIntoView) {
		const pageElement = document.getElementById('master-detailpage');
		if(pageElement){
			pageElement.scrollIntoView({behavior:'smooth', block:'start'});
		}
	}
}
// pass form data from master to detail
function setDetailPageFormData(){
	const record = masterRecord.value;
	 
	// set reply form data
	const replyStore = usePageStore('reply');
	replyStore.setFormData({  });
	 
	// set coursegrades form data
	const coursegradesStore = usePageStore('coursegrades');
	coursegradesStore.setFormData({ course_id:record?.id });
}
watch(() => masterRecord, () => {
		setDetailPageFormData();
		scrollToDetailPage();
	},
	{ deep: true, immediate: true }
);
onMounted(()=>{ 
    scrollToDetailPage();
});
</script>
