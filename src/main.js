import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import VueDatePicker from '@vuepic/vue-datepicker';
import Antd from 'ant-design-vue';
import '@vuepic/vue-datepicker/dist/main.css'
import 'ant-design-vue/dist/reset.css';

const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(Antd)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('VueDatePicker', VueDatePicker);
app.mount('#app')
