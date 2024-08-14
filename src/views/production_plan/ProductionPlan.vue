<template>
  <CContainer fluid>
    <CRow>
      <CCol xs="9">
        <h3>Production Plan</h3>
      </CCol>
      <CCol xs="2" >
        <MachineSelector v-model="selectedMachine" :addOption="allMachineOption"/>
      </CCol>
      <CCol xs="1" >
        <CButton :disabled="userRole ==='viewer'"  color="success" variant="outline" @click="openModal(null)">
          <CIcon icon="cilPlus" size="sm"/>  Plan
        </CButton>
      </CCol>
    </CRow>
  </CContainer>
  <div class="schedule-calendar">
    <ScheduleCalendar @edit-event="openModal" @delete-event="openModal" :eventTable="eventTable" @close="closeModal" :userRole="userRole" :idMachine="selectedMachine" @update-view="showToast('success', 'Updating views production plan success 👍')"/>
  </div>
  <ModalPlan :visible="modalVisible" :item="selectedItem" @close="closeModal" :eventTable="eventTable"/>
  <ToastNotif :color="toastProps.color" :body="toastProps.body" :toastVisible="toastProps.visible" :placement="toastProps.placement" />
</template>


<script setup>
import { ref, onBeforeMount } from 'vue';
import ScheduleCalendar from './ScheduleCalendar.vue';
import MachineSelector from '../production_report/daily_weekly/MachineSelector.vue'
import ModalPlan from './ModalPlan.vue';
import ToastNotif from '@/components/ToastNotif.vue'
import checkRoles from '@/middleware/CheckRoles'
import eventTable from '@/store/table';

const allMachineOption = ref({ label : 'ALL MACHINE', value : 'ALL'})
const modalVisible = ref(false);
const selectedMachine = ref('ALL');
const selectedItem = ref({});
const toastProps = ref({
  color : 'primary',
  body : '',
  visible: false,
  placement: 'top-end'
})

const userRole = ref('')

onBeforeMount(() => {
  getUserRole();
});

const openModal = (item) => {
  modalVisible.value = true
  selectedItem.value = item
};

const closeModal = () => {
  modalVisible.value = false;
};

const getUserRole = async () => {
  try {
    userRole.value = await checkRoles();
  } catch (error) {
    console.error('Error checking roles:', error.message);
  }
};

const showToast = (color, body) => {
  toastProps.value.visible = true
  toastProps.value.color = color
  toastProps.value.body = body
  setTimeout(() => {
    toastProps.value.visible = false;
  }, 5000);
}

</script>



<style scoped>
.schedule-calendar {
  height: 80vh;
  width:100%
}
.container-fluid{
  margin-bottom: .5rem;
}
</style>