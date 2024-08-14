<template>
  <CCard class="">
    <CCardHeader class="d-flex justify-content-between align-items-center">
        <h5>PCA Master List</h5>
        <div class="d-flex">
        <CButton v-if="userRole !== 'viewer'"  color="success" variant="outline" @click="openModal(null)">
            <CIcon icon="cil-plus" /> Register
        </CButton>
    </div>
    </CCardHeader>
    <CCardBody>
      <TablePca @edit-item="handleEditDeleteItem" @delete-item="handleEditDeleteItem"  @close="closeModal" @notif="showToast('success', 'Success Updating Data')" :userRole="userRole" :eventTable="eventTable"/>
      <ModalPca :visible="modalVisible" :item="selectedItem" @close="closeModal" :eventTable="eventTable"/>
    </CCardBody>
    <ToastNotif :color="toastColor" :body="toastBody" :toastVisible="toastVisible"/>
  </CCard>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import ToastNotif from '@/components/ToastNotif.vue'
import ModalPca from './ModalPca.vue';
import TablePca from './TablePca.vue';
import checkRoles from '@/middleware/CheckRoles'
import eventTable from '@/store/table'

export default {
  components: {
    ModalPca,
    TablePca,
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
