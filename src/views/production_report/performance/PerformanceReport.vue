<template>
  <CContainer fluid>
    <CRow class="mb-2">
      <CCol xs="8">
        <h3>Performance Report</h3>
      </CCol>
      <CCol xs="2">
        <MachineSelector v-model="selectedMachine" />
      </CCol>
      <CCol xs="2">
        <MonthSelector v-model="selectedMonth" />
      </CCol>
    </CRow>
  </CContainer>
  <CRow>
    <MultiChart
      :seriesData="[dailyOee.daily_oee.availability, dailyOee.daily_oee.productivity,dailyOee.daily_oee.quality, dailyOee.daily_oee.oee]"
      :seriesName="['Availability','Productivity','Quality','OEE']"
      :xAxis="dailyOee.date_range"
      :legend="['Availability','Productivity','Quality','OEE']"
      chartTitle="Daily OEE"
      xAxisName="Percent"
      :colSize="9"
      :height="40"
    />
    <GaugeChart 
    :height="40"
    :oeeValue="totalOee"
    />
  </CRow>
  <!-- <CRow>
    <h1>MQTT DATA</h1>
    <p>Topic : </p>
    <p>Data : {{ dataSensor }}</p>
  </CRow> -->
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import MachineSelector from '../daily_weekly/MachineSelector.vue'
import MonthSelector from '../monthly/MonthSelector.vue'
import MultiChart from '../daily_weekly/MultiChart.vue'
import GaugeChart from './GaugeChart.vue'
import axios from 'axios'
// import mqtt from 'mqtt'

const selectedMachine = ref('STAMPING LINE 1')
const selectedMonth = ref({ month: new Date().getMonth(), year: new Date().getFullYear() })
const dailyOee = ref({
  date_range: [],
  daily_oee:{
    oee:[],
    availability:[],
    productivity:[],
    quality:[]
  }
})
const totalOee = ref({
  availability: 0,
  oee : 0,
  productivity: 0,
  quality : 0
})

// const dataSensor = ref('')
// const options = {
//         username: 'frontend',
//         password: 'Riankurnia20',
//         clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
//     };

watch([selectedMachine, selectedMonth], ([newMachine, newMonth]) =>{
  fetchDailyOee(newMachine, newMonth.year, newMonth.month)
  fetchMonthlyOee(newMachine, newMonth.year, newMonth.month)
})

onBeforeMount( async () => {
  await fetchDailyOee(selectedMachine.value, selectedMonth.value.year, selectedMonth.value.month)
  await fetchMonthlyOee(selectedMachine.value, selectedMonth.value.year, selectedMonth.value.month)
})

// onMounted(() =>{
//   console.log(options)
// // connect to your cluster, insert your host name and port
// const client = mqtt.connect('wss://c53c2dae35f8457a81d465a2c399c47c.s1.eu.hivemq.cloud:8884/mqtt', options);

// // prints a received message
// client.on('message', function(topic, message) {
//   console.log(String.fromCharCode.apply(null, message)); // need to convert the byte array to string
//   dataSensor.value = String.fromCharCode.apply(null, message)
// });

// // reassurance that the connection worked
// client.on('connect', () => {
//   console.log('Connected!');
// });

// // prints an error message
// client.on('error', (error) => {
//   console.log('Error:', error);
// });

// // subscribe and publish to the same topic
// client.subscribe('test/sensor');
// // client.publish('data/sensor', 'Hello, this message was received!');
// })

const fetchDailyOee = async(machine, year, month) => {
  try {
    const url = `http://192.168.148.125:5000/productions/date/oee?year=${year}&month=${month+1}&id_machine=${machine}`
    const response = await axios.get(url)
    dailyOee.value = response.data.data
  } catch (error) {
    console.error('Error fetching oee data: ', error)
  }
}


const fetchMonthlyOee = async(machine, year, month) =>{
  try {
    const url = `http://192.168.148.125:5000/productions/monthly/oee?year=${year}&month=${month+1}&id_machine=${machine}`
    const response = await axios.get(url)
    totalOee.value = response.data.data[0]
  } catch (error) {
    console.error('Error fetching oee data: ',error)
  }
}
</script>

<style scoped>
.row {
  margin-bottom: rem;
}
</style>
