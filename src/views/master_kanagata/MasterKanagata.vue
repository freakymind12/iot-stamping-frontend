<template>
  <CCard class="" style="margin-bottom: 1rem;">
    <CCardHeader class="d-flex justify-content-between align-items-center">
        <h5>Kanagata Master List</h5>
        <div class="d-flex">
        <CButton v-if="userRole !== 'viewer'" color="success" variant="outline" @click="openModal(null)">
            <CIcon icon="cil-plus" /> Add
        </CButton>
    </div>
    </CCardHeader>
    <CCardBody>
      <TableKanagata @edit-item="handleEditDeleteItem" @delete-item="handleEditDeleteItem" @close="closeModal" @notif="showToast('success', 'Success Updating Data')" :userRole="userRole" :eventTable="eventTable"/>
      <ModalKanagata :visible="modalVisible" :item="selectedItem" @close="closeModal" :eventTable="eventTable"/>
    </CCardBody>
    <ToastNotif :color="toastColor" :body="toastBody" :toastVisible="toastVisible"/>
  </CCard>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import ToastNotif from '@/components/ToastNotif.vue';
import ModalKanagata from './ModalKanagata.vue';
import TableKanagata from './TableKanagata.vue';
import checkRoles from '@/middleware/CheckRoles';
import eventTable from '@/store/table';

export default {
  components: {
    ModalKanagata,
    TableKanagata,
    ToastNotif
  },
  setup() {
    const modalVisible = ref(false);
    const selectedItem = ref(null);
    const userRole = ref('');
    const toastColor = ref('')
    const toastBody = ref('')
    const toastVisible = ref(false)

    // Fungsi untuk memeriksa peran pengguna saat komponen dimuat
    const getUserRole = async () => {
      try {
        userRole.value = await checkRoles();
      } catch (error) {
        console.error('Error checking roles:', error.message);
      }
    };

    onBeforeMount( async () => {
      await getUserRole();
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
      toastVisible
    };
  }
};
</script>
