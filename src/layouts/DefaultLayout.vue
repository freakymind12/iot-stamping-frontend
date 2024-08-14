<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body">
        <CContainer class="px-4" fluid>    
          <router-view />
          <ScrollToTop/>
        </CContainer>
      </div>
      <!-- <AppFooter /> -->
    </div>
  </div>
</template>

<script>
import { CContainer } from '@coreui/vue'
// import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import ScrollToTop from '@/components/ScrollToTop.vue';

export default {
  name: 'DefaultLayout',
  components: {
    // AppFooter,
    AppHeader,
    AppSidebar,
    CContainer,
    ScrollToTop
  },
}
</script>
