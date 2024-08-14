<template>
    <Qalendar 
      :events="events"
      :config="config"
      @edit-event="handleEditEvent"
      @delete-event="handleDeleteEvent" />
</template>

<script setup>
import axios from "axios";
import { Qalendar } from "qalendar";
import { onMounted, ref, watch } from "vue";
import formatDate from '@/middleware/LocaleDate';

const emit = defineEmits(['edit-event', 'delete-event', 'close', 'update-view'])
const props = defineProps({
  eventTable: Object,
  userRole: String,
  idMachine: String
})

onMounted(()=>{
  fetchData()
})

watch(() => props.eventTable.refreshPlan, (newValue) => {
  if(newValue){
    fetchData()
    // eslint-disable-next-line vue/no-mutating-props
    props.eventTable.refreshPlan = false
    emit('close')
    emit('update-view')
  }
})

watch(() => props.idMachine, (newValue) => {
  if(newValue){
    fetchData()
    emit('update-view')
  }
})


const config = ref({
  // disableModes: ['day'],
  defaultMode: 'month',
  style: {
    fontFamily: 'Arial',
    colorSchemes: {
      shift1: {
        color: '#000',
        backgroundColor: '#4158A6',
      },
      shift2: {
        color: '#000',
        backgroundColor: '#FF8343',
      }
    }
  },
  locale: 'id-ID',
})

const events = ref([])

const handleEditEvent = (event) => {
  if(props.userRole !== 'viewer'){
    const editItem = {id_plan:event , mode:'edit' }
    emit('edit-event', editItem);
  }
};

const handleDeleteEvent = (event) => {
  if(props.userRole !== 'viewer'){
    const deleteItem = {id_plan:event , mode:'delete' }
    emit('delete-event', deleteItem);
  }
};

const fetchData = () => {
  axios.get(`http://192.168.148.125:5000/plan?id_machine=${props.idMachine}`)
    .then(response => {
      const formattedData = response.data.data.map(item => {
        let title;
        if (props.idMachine === 'ALL') {
          title = item.id_machine;
        } else {
          title = item.name;
        }
        return {
          id: item.id_plan,
          description: 'Qty : ' + item.qty.toLocaleString() + ' / Machine : ' + item.id_machine + ' / Product : ' + item.name + ' / Kanagata : ' + item.id_kanagata + ' / Shift : ' + item.shift,
          topic: `Plan time : ${item.time_plan} minutes`,
          disableDnD: ['month','week','day'],
          disableResize : ['month','week','day'],
          isEditable: true,        
          title : title,
          colorScheme: 'shift'+ item.shift,
          time : {start: formatDate(item.start, false), end: formatDate(item.end, false)},
        };
      });
      events.value = formattedData;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};


</script>

<style>
  @import "qalendar/dist/style.css";
</style>