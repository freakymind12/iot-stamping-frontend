<template>
  <CContainer fluid>
    <CRow class="mb-2">
      <CCol xs="8">
        <h3>Machine History</h3>
      </CCol>
      <CCol xs="2">
        <MachineSelector v-model="selectedMachine" />
      </CCol>
      <CCol xs="2">
        <DateSelector v-model="selectedDate" minRange="1" />
      </CCol>
    </CRow>
  </CContainer>
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardHeader class="card-header-flex">
          <p class="card-title">Log Status Machine</p>
          <a-tooltip>
            <template #title>Switch mode</template>
            <CButton color="primary" variant="outline" size="sm" @click="switchTimelineMachine">
              <CIcon icon="cilLoopCircular" size="sm" />
            </CButton>
          </a-tooltip>
        </CCardHeader>
        <CCardBody class="card-body">
          <TimelineStatus v-if="showTimelineMachine" :data="machineHistory" />
          <TableHistoryMachine v-else :rowsData="machineHistory" :colsData="cols1" />
        </CCardBody>
      </CCard>
    </CCol>
    <CCol>
      <CCard>
        <CCardHeader class="card-header-flex">
          <p class="card-title">Log Maintenance Kanagata Part</p>
          <CButton color="primary" variant="outline" size="sm"
            ><CIcon icon="cilLoopCircular" size="sm"
          /></CButton>
        </CCardHeader>
        <CCardBody class="card-body">
          <TableHistoryMachine :rowsData="logMaintenance" :colsData="cols2" />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import { ref, onBeforeMount, watch, onMounted } from 'vue'
import MachineSelector from '../production_report/daily_weekly/MachineSelector.vue'
import checkRoles from '@/middleware/CheckRoles'
import TableHistoryMachine from './TableHistoryMachine.vue'
import DateSelector from '../production_report/daily_weekly/DateSelector.vue'
import axios from 'axios'
import TimelineStatus from './TimelineStatus.vue'

const selectedMachine = ref('STAMPING LINE 1')
const machineHistory = ref([])
const logMaintenance = ref([])
const currentDate = new Date()
const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 2)
const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
const showTimelineMachine = ref(false)

const selectedDate = ref([
  startDate.toISOString().split('T')[0],
  endDate.toISOString().split('T')[0],
])

const cols1 =
  ref([
    { field: 'id_machine', title: 'Machine', sort:false },
    { field: 'status', title: 'Status', sort:false },
    { field: 'stop_condition', title: 'Stop Condition', sort:false },
    { field: 'power', title: 'Power Status', sort:false, maxWidth:'70px' },
    { field: 'duration', title: 'Duration (min)', type: 'number', sort:false , maxWidth:'70px' },
    { field: 'start', title: 'Start', type: 'date' },
    { field: 'end', title: 'End', type: 'date' },
  ]) || []

const cols2 =
  ref([
    { field: 'created_at', title: 'Date', type: 'date' },
    { field: 'id_machine', title: 'Machine' },
    { field: 'part', title: 'Kanagata Part' },
  ]) || []

const userRole = ref('')
onBeforeMount(() => {
  getUserRole()
})

onMounted(() => {
  fetchFinalStatusMachine(selectedDate.value, selectedMachine.value)
  fetchMaintenancePart(selectedDate.value, selectedMachine.value)
})

watch([selectedDate, selectedMachine], ([newDate, newMachine]) => {
  fetchFinalStatusMachine(formatDateArray(newDate), newMachine)
  fetchMaintenancePart(formatDateArray(newDate), newMachine)
})

const getUserRole = async () => {
  try {
    userRole.value = await checkRoles()
  } catch (error) {
    console.error('Error checking roles:', error.message)
  }
}

const fetchFinalStatusMachine = (date, machine) => {
  axios
    .get(
      `http://192.168.148.125:5000/final_status/date?date_start=${date[0]}&date_end=${date[1]}&machine=${machine}`,
    )
    .then((response) => {
      const formattedData = response.data.data
      machineHistory.value = formattedData
    })
    .catch((error) => {
      console.log('Error fetching data:', error)
    })
}

const fetchMaintenancePart = (date, machine) => {
  axios
    .get(
      `http://192.168.148.125:5000/maintenance_part/date?date_start=${date[0]}&date_end=${date[1]}&id_machine=${machine}`,
    )
    .then((response) => {
      const formattedData = response.data.data
      logMaintenance.value = formattedData
    })
    .catch((error) => {
      console.log('Error fetching data:', error)
    })
}

const formatDateArray = (dates) => {
  return dates.map((dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    return `${year}-${month}-${day}`
  })
}

const switchTimelineMachine = () => {
  showTimelineMachine.value = !showTimelineMachine.value
}
</script>

<style scoped>
.card-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  margin: 0;
  font-size: medium;
  font-weight: 700;
}

.card-body {
  max-height: 700px;
  overflow-y: auto;
}

/* Customizing the scrollbar */
.card-body::-webkit-scrollbar {
  width: 8px; /* Adjust the width of the scrollbar */
}

/* Customizing the track */
.card-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Customizing the thumb */
.card-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px; /* Round corners */
}

/* Customizing the thumb when hovered */
.card-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
