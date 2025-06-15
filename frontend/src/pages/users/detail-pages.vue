<template>
    <div id="master-detailpage">
        <TabView v-model:activeIndex="activeTab">
            <template v-if="auth.canView('courses')">
                <TabPanel>
                    <template #header>
                        <div class=" text-lg font-bold" >
                            {{ $t('userCourses') }}
                        </div>
                    </template>
                    <div class="card my-3 p-3 surface-50">
                        <CoursesListPage ref="coursesListPage"  field-name="courses.teacher_id" :field-value="masterRecord.userid" :show-header="false" :show-breadcrumbs="false" isSubPage>
                        </CoursesListPage>
                    </div>
                </TabPanel>
            </template>
            <template v-if="auth.canView('likes')">
                <TabPanel>
                    <template #header>
                        <div class=" text-lg font-bold" >
                            {{ $t('userLikes') }}
                        </div>
                    </template>
                    <div class="card my-3 p-3 surface-50">
                        <LikesListPage ref="likesListPage"  field-name="likes.userid" :field-value="masterRecord.userid" :show-header="false" :show-breadcrumbs="false" isSubPage>
                            </LikesListPage>
                        </div>
                    </TabPanel>
                </template>
                <template v-if="auth.canView('certificates')">
                    <TabPanel>
                        <template #header>
                            <div class=" text-lg font-bold" >
                                {{ $t('userCertificates') }}
                            </div>
                        </template>
                        <div class="card my-3 p-3 surface-50">
                            <CertificatesListPage ref="certificatesListPage"  field-name="certificates.student_id" :field-value="masterRecord.userid" :show-header="false" :show-breadcrumbs="false" isSubPage>
                            </CertificatesListPage>
                        </div>
                    </TabPanel>
                </template>
                <template v-if="auth.canView('collents')">
                    <TabPanel>
                        <template #header>
                            <div class=" text-lg font-bold" >
                                {{ $t('userCollents') }}
                            </div>
                        </template>
                        <div class="card my-3 p-3 surface-50">
                            <CollentsListPage ref="collentsListPage"  field-name="collents.userid" :field-value="masterRecord.userid" :show-header="false" :show-breadcrumbs="false" isSubPage>
                            </CollentsListPage>
                        </div>
                    </TabPanel>
                </template>
                <template v-if="auth.canView('studyrecords')">
                    <TabPanel>
                        <template #header>
                            <div class=" text-lg font-bold" >
                                {{ $t('userStudyRecords') }}
                            </div>
                        </template>
                        <div class="card my-3 p-3 surface-50">
                            <StudyrecordsListPage ref="studyrecordsListPage"  field-name="study_records.userid" :field-value="masterRecord.userid" :show-header="false" :show-breadcrumbs="false" isSubPage>
                            </StudyrecordsListPage>
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
import CoursesListPage from "../courses/list.vue";
import LikesListPage from "../likes/list.vue";
import CertificatesListPage from "../certificates/list.vue";
import CollentsListPage from "../collents/list.vue";
import StudyrecordsListPage from "../studyrecords/list.vue";
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
const store = usePageStore('USERS');
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
	 
	// set courses form data
	const coursesStore = usePageStore('courses');
	coursesStore.setFormData({ teacher_id:record?.userid });
	 
	// set likes form data
	const likesStore = usePageStore('likes');
	likesStore.setFormData({ userid:record?.userid });
	 
	// set certificates form data
	const certificatesStore = usePageStore('certificates');
	certificatesStore.setFormData({ student_id:record?.userid });
	 
	// set collents form data
	const collentsStore = usePageStore('collents');
	collentsStore.setFormData({  });
	 
	// set studyrecords form data
	const studyrecordsStore = usePageStore('studyrecords');
	studyrecordsStore.setFormData({  });
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
