<template>
  <div 
    v-if="isVisible" 
    class="scroll-to-top" 
    @click="scrollToTop" 
    :style="{ opacity: opacity }"
  >
    <slot><CIcon icon="cilArrowCircleTop" size="xl"/></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isVisible = ref(false);
const opacity = ref(0);

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPercentage = scrollTop / (documentHeight - windowHeight);
  
  isVisible.value = scrollPercentage > 0.5;
  opacity.value = scrollPercentage;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  background-color: #858585;
  color: #fff;
  width: 50px; /* Set width and height to make it circular */
  height: 50px;
  display: flex; /* Center the content */
  align-items: center;
  justify-content: center;
  border-radius: 50%; /* Make it circular */
  transition: opacity 0.3s ease;
}

</style>
