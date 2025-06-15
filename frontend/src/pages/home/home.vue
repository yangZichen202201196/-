<template>
    <main class="main-page" id="">
        <section class="page-section q-pa-md" >
            <div class="container-fluid">
                <div class="grid ">
                    <div  class="col comp-grid" >
                        <div class=" text-lg font-bold text-primary" >
                            {{ $t('home') }}
                        </div>
                        <div class="">
                            <div class="hero-carousel-wrapper">
                                <Carousel :value="slides" 
                                :numVisible="1" 
                                :numScroll="1" 
                                :autoplayInterval="5000"
                                :circular="true"
                                class="hero-carousel">
                                <template #item="slotProps">
                                    <div class="carousel-item-wrapper">
                                        <!-- 背 景 图 片 容 器 -->
                                        <div class="image-wrapper">
                                            <img :src="slotProps.data.image" 
                                            :alt="slotProps.data.title"
                                            class="background-image" />
                                        </div>
                                        <!-- 内 容 遮 罩 和 文 字 -->
                                        <div class="content-overlay">
                                            <div class="container mx-auto px-4">
                                                <div class="content-wrapper">
                                                    <h1 class="slide-title">{{ slotProps.data.title }}</h1>
                                                    <p class="slide-description">{{ slotProps.data.description }}</p >
                                                    <div class="button-group">
                                                        <Button v-if="slotProps.data.primaryButton"
                                                        :label="slotProps.data.primaryButton" 
                                                        severity="primary" 
                                                        size="large" 
                                                        @click="navigateToMusics(slotProps.data.id)"/>
                                                        <Button v-if="slotProps.data.secondaryButton"
                                                        :label="slotProps.data.secondaryButton" 
                                                        outlined
                                                        class="secondary-button"
                                                        size="large" 
                                                        @click="navigateToDetails(slotProps.data.id)"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                </Carousel>
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
	const slides = ref([
{
    id: 1,
    title: '探索无限可能',
    description: '让我们一起创造令人惊叹的数字体验，突破创新的边界。',
    image: '/images/02.jpg',
    primaryButton: '立即开始',
    secondaryButton: '了解更多'
},
{
    id: 2,
    title: '引领技术革新',
    description: '采用最新技术，打造前所未有的用户体验。',
    image: '/images/03.jpg',
    primaryButton: '查看案例',
},
{
    id: 3,
    title: '专业团队支持',
    description: '我们的专家团队随时准备为您提供支持和解决方案。',
    image: '/images/04.jpg',
}
])
const navigateToMusics = (id) => {
    // 这里可以根据id进行不同的逻辑处理，现在统一跳转到音乐列表页面
    window.location.href = 'http://localhost:8050/#/courses';
};
const navigateToDetails = (id) => {
    // 这里可以根据id进行不同的逻辑处理，比如跳转到对应的详情页面
    window.location.href = 'http://localhost:8050/#/courses';
    console.log('Navigate to details for slide:', id);
};

</script>
<style >
.hero-carousel-wrapper {
  position: relative;
  height: 600px;
}
.carousel-item-wrapper {
  position: relative;
  height: 600px;
  width: 100%;
}
.image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.3));
  display: flex;
  align-items: center;
  z-index: 2;
}
.content-wrapper {
  max-width: 32rem;
  color: white;
}
.slide-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}
.slide-description {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  color: white;
}
.button-group {
  display: flex;
  gap: 1rem;
}
.secondary-button {
  color: white;
  border-color: white;
}
.secondary-button:hover {
  background-color: white;
  color: #333;
}
:deep(.p-carousel) {
  height: 100%;
}
:deep(.p-carousel-container) {
  height: 100%;
}
:deep(.p-carousel-items-container) {
  height: 100%;
}
:deep(.p-carousel-indicators) {
  position: absolute;
  bottom: 2rem;
  z-index: 3;
}
:deep(.p-carousel-indicator button) {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
}
:deep(.p-carousel-indicator.p-highlight button) {
  background-color: white;
}
:deep(.p-carousel-prev),
:deep(.p-carousel-next) {
  width: 3rem;
  height: 3rem;
  border: 2px solid white;
  border-radius: 50%;
  background-color: transparent;
  color: white;
  margin: 0 2rem;
  z-index: 3;
}
:deep(.p-carousel-prev:hover),
:deep(.p-carousel-next:hover) {
  background-color: white;
  color: #333;
}
</style>
