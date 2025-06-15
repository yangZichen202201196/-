<template>
    <main class="main-page" id="">
        <section class="page-section q-pa-md" >
            <div class="container-fluid">
                <div class="grid ">
                    <div  class="col comp-grid" >
                        <div class=" text-lg font-bold text-primary" >
                            {{ $t('teacher') }}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="page-section mb-3" >
            <div class="container-fluid">
                <div class="grid ">
                    <div  class="col comp-grid" >
                        <div class="">
                            <div class="card my-3 p-3 surface-50">
                                <UsersListPage ref="usersListPage"  :limit="10" field-name="users.user_role_id" field-value="3" sort-by="users.userid" sort-type="ASC" :show-header="true" :show-breadcrumbs="true" :show-footer="true" :paginate="true" page-store-key="INDEX-USERS" is-sub-page>
                                </UsersListPage>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

</template>
<script setup>
	import {  ref } from 'vue';
	
	
	import { useApp } from 'src/composables/app.js';
	
	import { $t } from 'src/services/i18n';
	import UsersListPage from "../users/list.vue";
	
	const props = defineProps({
		pageName: {
			type: String,
			default: 'home',
		},
		routeName: {
			type: String,
			default: 'home',
		},
		isSubPage: {
			type : Boolean,
			default : false,
		},
	});
	const app = useApp();
	
	const pageReady = ref(true);
	const axios = require('axios');
let data = JSON.stringify({
    query: `query txInfo {
        blocks(from: 10550,to: 10560) {
            transactions {
                hash
                from {
                    address
                }
                to {
                    address
                }
                value
            }
        }
    }`,
    variables: {}
});
let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8888/graphql',
    headers: { 
        'Content-Type': 'application/json'
    },
    data : data
};
axios.request(config)
.then((response) => {
    console.log(JSON.stringify(response.data));
})
.catch((error) => {
    console.log(error);
});

</script>
<style scoped>
</style>
