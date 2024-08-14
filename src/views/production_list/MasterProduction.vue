<template>
  <CContainer fluid style="margin-bottom: 1rem;">
    <CRow>
      <CCol xs="8">
        <h3>Production List</h3>
      </CCol>
      <CCol xs="2">
        <MachineSelector v-model="selectedMachine"/>
      </CCol>
      <CCol xs="2">
        <MonthSelector v-model="selectedMonth"/>
      </CCol>
    </CRow>
  </CContainer>
  <CCard>
    <CCardBody>
      <TableProduction @edit-item="handleEditDeleteItem" @delete-item="handleEditDeleteItem" @close="closeModal" @notif="showToast('success', 'Success Updating Data')" :userRole="userRole" :eventTable="eventTable" :selector="{selectedMachine, selectedMonth}"/>
    </CCardBody>
  </CCard>
    <ModalProduction :visible="modalVisible" :item="selectedItem" @close="closeModal" :eventTable="eventTable"/>
    <ToastNotif :color="toastColor" :body="toastBody" :toastVisible="toastVisible"/>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import ToastNotif from '@/components/ToastNotif.vue'
import TableProduction from './TableProduction.vue';
import ModalProduction from  './ModalProduction.vue';
import MonthSelector from '../production_report/monthly/MonthSelector.vue';
import MachineSelector from '../production_report/daily_weekly/MachineSelector.vue';
import checkRoles from '@/middleware/CheckRoles'
import eventTable from '@/store/table'

export default {
  components: {
    TableProduction,
    ModalProduction,
    ToastNotif,
    MonthSelector,
    MachineSelector
  },
  setup() {
    const modalVisible = ref(false);
    const selectedItem = ref(null);
    const userRole = ref('');
    const toastColor = ref('')
    const toastBody = ref('')
    const toastVisible = ref(false)
    const selectedMachine = ref('STAMPING LINE 1')
    const selectedMonth = ref({month: new Date().getMonth(), year: new Date().getFullYear()});

    // Fungsi untuk memeriksa peran pengguna saat komponen dimuat
    const getUserRole = async () => {
      try {
        userRole.value = await checkRoles();
      } catch (error) {
        console.error('Error checking roles:', error.message);
      }
    };

    onBeforeMount(() => {
      getUserRole();
    });

    const openModal = (item) => {
      selectedItem.value = item;
      modalVisible.value = true;
    };

    const closeModal = () => {
      modalVisible.value = false;
    };

    const handleEditDeleteItem = (item) => {
      openModal(item);
    };

    const showToast = (color, body) => {
      toastVisible.value = true
      toastColor.value= color
      toastBody.value= body
      setTimeout(() => {
        toastVisible.value = false;
      }, 5000);
    }
    
    return {
      modalVisible,
      selectedItem,
      openModal,
      closeModal,
      handleEditDeleteItem,
      userRole,
      eventTable,
      showToast,
      toastBody,
      toastColor,
      toastVisible, 
      selectedMachine,
      selectedMonth
    };
  }
};
</script>
