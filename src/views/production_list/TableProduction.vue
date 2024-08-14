<template>
  <CRow>
    <CCol sm="2" class="mb-2">
      <CFormInput size="sm" type="text" id="searchData" v-model="search" placeholder="Search" />
    </CCol>
  </CRow>
  <div>
    <vue3-datatable
      :rows="rows"
      :columns="cols"
      :loading="loading"
      :sortable="true"
      skin="bh-table-hover bh-table-bordered bh-table-compact"
      :search="search"
      style="font-size: small"
      :pageSize="15"
      :pageSizeOptions="[10, 15, 30, 50, 100]"
    >
      <template #id="data">
        <strong>{{ data.id_production }}</strong>
      </template>
      <template #actions="data">
        <div class="flex gap-4">
          <CButton
            size="sm"
            class="btn-primary"
            style="margin: 0.1rem"
            @click="editItem(data.value)"
            v-if="userRole !== 'viewer'"
          >
            <CIcon icon="cil-pencil" />
          </CButton>
        </div>
      </template>
    </vue3-datatable>
  </div>
</template>
<script setup>
import axios from 'axios'
import { ref, onMounted, getCurrentInstance, watch } from 'vue'
import Vue3Datatable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import formatDate from '@/middleware/LocaleDate'

const instance = getCurrentInstance()
const search = ref('')
const props = defineProps(['userRole', 'eventTable', 'selector'])
onMounted(() => {
  fetchData()
})

watch(
  () => props.eventTable.refreshProduction,
  (newValue) => {
    if (newValue) {
      fetchData()
      // eslint-disable-next-line vue/no-mutating-props
      props.eventTable.refreshProduction = false
      instance.emit('close')
      instance.emit('notif')
    }
  },
)

watch(
  () => props.selector,
  (newValue) => {
    if (newValue) {
      fetchData()
    }
  },
)

const loading = ref(true)
const data = ref([])
const pageSize = ref()
const rows = ref(null)

const cols =
  ref([
    // { field: 'id_production', title: 'ID', isUnique: true },
    { field: 'date', title: 'Date', minWidth: '145px' },
    { field: 'id_machine', title: 'Machine', minWidth: '130px', sort: false },
    { field: 'id_kanagata', title: 'Kanagata', sort: false },
    { field: 'id_product', title: 'DP Code', sort: false, minWidth: '120px' },
    { field: 'name', title: 'Product Name', minWidth: '150px', sort: false },
    { field: 'shift', title: 'Shift', sort: false },
    { field: 'qty_plan', title: 'Output Plan', sort: false },
    { field: 'ok', title: 'Good Product', sort: false },
    { field: 'ng', title: 'RIP', sort: false, minWidth: '80px' },
    { field: 'reject_setting', title: 'Reject Setting', sort: false },
    { field: 'dummy', title: 'Dummy', sort: false },
    { field: 'production_time', title: 'Production Time', sort: false },
    { field: 'stop_time', title: 'Stop Time', sort: false },
    { field: 'dandori_time', title: 'Dandori Time', sort: false },
    { field: 'kadoritsu', title: 'Kadoritsu', sort: false },
    { field: 'bekidoritsu', title: 'Bekidoritsu', sort: false },
    { field: 'actions', title: 'Actions', sort: false },
  ]) || []

const fetchData = () => {
  axios
    .get(
      `http://192.168.148.125:5000/productions/filter?id_machine=${
        props.selector.selectedMachine
      }&year=${props.selector.selectedMonth.year}&month=${props.selector.selectedMonth.month + 1}`,
    )
    .then((response) => {
      const formattedData = response.data.data.map((item) => ({
        ...item,
        date: formatDate(item.date),
        ok: item.ok.toLocaleString(),
        reject_setting: item.reject_setting.toLocaleString(),
        ng: item.ng.toLocaleString(),
        dummy: item.dummy.toLocaleString(),
        qty_plan: item.qty_plan ? item.qty_plan.toLocaleString() : 0,
        bekidoritsu: item.bekidoritsu ? item.bekidoritsu : 0,
      }))
      // console.log(formattedData)
      data.value = formattedData
      rows.value = formattedData // Assign formatted data to rows
      loading.value = false // Update loading status after data is fetched
      pageSize.value = formattedData.length
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      loading.value = false // Update loading status in case of error
    })
}

const editItem = (item) => {
  instance.emit('edit-item', item)
}
</script>
