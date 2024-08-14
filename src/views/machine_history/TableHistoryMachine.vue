<template>
    <CRow class="mb-2">
        <CCol sm="4">
            <CFormInput size="sm" type="text" id="searchData" v-model="search" placeholder="Search"/>
        </CCol>
    </CRow>
        <vue3-datatable :rows="props.rowsData" :columns="props.colsData" :sortable="true" :pageSize="15" :pageSizeOptions="[10, 15, 30, 50, 100]" skin="bh-table-hover bh-table-bordered bh-table-compact" :search="search" style="font-size: 0.8rem;"/>
</template>

<script setup>
import Vue3Datatable from '@bhplugin/vue3-datatable';
import '@bhplugin/vue3-datatable/dist/style.css';
import { ref } from 'vue';

const search = ref('')

const props = defineProps({
    rowsData:Array,
    colsData:Array
})

</script>