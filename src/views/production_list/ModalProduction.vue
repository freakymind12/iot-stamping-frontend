<template>

  <CModal 
    :visible="visible"
    @close="$emit('close')"
    aria-labelledby="LiveDemoExampleLabel"
    alignment="center"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">{{ mode === 'update' ? 'Edit' : mode === 'delete' ? 'Delete' : 'Add' }} Production Data</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow>
        <CCol>
          <CForm>
            <!-- <CFormInput
              type="text"
              id="idProduction"
              floatingLabel="ID Production"
              placeholder="ID Production"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="dataSelected.id_production"
              class="form-input"
              disabled
            /> -->
            <CFormInput
              type="text"
              id="date"
              floatingLabel="Date"
              placeholder="Date"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="dataSelected.date"
              class="form-input"
              disabled
            />
            <CFormInput
              type="text"
              id="idMachine"
              floatingLabel="Machine"
              placeholder="Machine"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="dataSelected.id_machine"
              class="form-input"
              disabled
            />
            <CFormInput
              type="text"
              id="productName"
              floatingLabel="Product Name"
              placeholder="Product Name"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="dataSelected.name"
              class="form-input"
              disabled
            />
            <CFormInput
              type="text"
              id="shift"
              floatingLabel="Shift"
              placeholder="Shift"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="dataSelected.shift"
              class="form-input"
              disabled
            />
          </CForm>
        </CCol>
        <CCol>
          <CForm>
            <CFormInput
              type="text"
              id="outputProduction"
              floatingLabel="Good Product"
              placeholder="Good Product"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="dataSelected.ok"
              class="form-input"
              disabled
            />
            <CFormInput
              type="text"
              id="rejectSetting"
              floatingLabel="Reject Setting (F-028)"
              placeholder="Reject Setting"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="rejectSetting"
              class="form-input"
              disabled
            />
            <CFormInput
              type="text"
              id="dummy"
              floatingLabel="Dummy (F-027)"
              placeholder="Dummy"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="dummy"
              class="form-input"
            />
            <CFormInput
              type="text"
              id="rip"
              floatingLabel="Reject In Process"
              placeholder="Reject In Process"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              v-model="rip"
              class="form-input"
            />
            
          </CForm>
        </CCol>
      </CRow>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" variant="outline" @click="$emit('close')">
        Close
      </CButton>
      <CButton variant="outline"
      :color="mode === 'update' ? 'primary' : mode === 'delete' ? 'danger' : 'success'" 
      @click="mode === 'update' ? updateProduction() : mode === 'delete' ? deleteProduct() : addProduct()"
      >
        {{ mode === 'update' ? 'Update' : mode === 'delete' ? 'Delete' : 'Save' }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import { ref, watch } from 'vue';
import axios from 'axios';

export default {
  name: 'ModalProduction',
  
  // props untuk komponen, didapat dari parent component
  props: {
    visible: Boolean,
    item: Object,
    eventTable: Object,
  },

  setup(props) {
    const idProduction = ref('')
    const rejectSetting = ref('');
    const rip = ref('')
    const dummy = ref('');
    const dataSelected = ref({})
    const errorMessage = ref('');
    const mode = ref('update'); 

    watch(() => props.item, (newValue) => {
      if (newValue) {
        rip.value = newValue.ng
        dummy.value = newValue.dummy
        rejectSetting.value = newValue.reject_setting
        idProduction.value = newValue.id_production
        dataSelected.value = newValue
      }
  });

    const resetForm = () => {
      idProduction.value = '';
      rejectSetting.value = '';
      rip.value= '';
      dummy.value= '';
      dataSelected.value= {};
    }

    // const updateProduction = async () => {
    //   try {
    //     const response = await axios.patch(`http://192.168.148.125:5000/productions/${idProduction.value}`, {
    //       ng: rip.value,
    //       reject_setting: rejectSetting.value,
    //       dummy: dummy.value
    //     });
    //     props.eventTable.refreshProduction = true;
    //     resetForm()
    //     // console.log(response.data);
    //     // window.location.reload();
    //   } catch (error) {
    //     errorMessage.value = error.response.data.message;
    //     console.error(error);
    //   }
    // }

    const updateProduction = async () => {
      try {
        const response = await axios.patch(`http://192.168.148.125:5000/productions/${idProduction.value}`, {
          ng: rip.value,
          // reject_setting: rejectSetting.value,
          dummy: dummy.value
        });
        props.eventTable.refreshProduction = true;
        resetForm()
        // console.log(response.data);
        // window.location.reload();
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }


    return { 
      rip,
      rejectSetting,
      dataSelected,
      errorMessage,
      mode,
      dummy,
      // addProduct,
      updateProduction,
    }
  }
}
</script>
