<template>

  <CModal 
    :visible="visible"
    @close="$emit('close')"
    aria-labelledby="LiveDemoExampleLabel"
    alignment="center"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">{{ mode === 'update' ? 'Edit' : mode === 'delete' ? 'Delete' : 'Add' }} Machine Data</CModalTitle>
    </CModalHeader>
    <CModalBody v-if="mode !== 'delete'">
      <CForm>
        <CFormInput
          type="text"
          id="idMachine"
          label="ID Machine"
          placeholder="ID Machine"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="idMachine"
          class="form-input"
          :disabled="mode === 'update'"
        />
        <CFormSelect v-if="mode !== 'create'"
          label="Shift"
          :options="[
            { label: 'Short', value: 'short' },
            { label: 'Long', value: 'long' },
          ]" 
          v-model="shift"
          class="form-input"
        />
        <CFormInput  v-if="mode !== 'create'"
          type="text"
          id="actualShot"
          label="Actual Shots"
          placeholder="Actual Shots"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="actualShot"
          class="form-input"
          :disabled="mode === 'create'"
        />
        <CFormInput  v-if="mode !== 'create'"
          type="text"
          id="limitShot"
          label="Limit Shots"
          placeholder="Limit Shots"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="limitShot"
          class="form-input"
          :disabled="mode === 'create'"
        />
        <CFormInput
          type="text"
          id="address"
          label="Machine Address"
          placeholder="Machine Address"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="machineAddress"
          class="form-input"
          :disabled="mode === 'update'"
        />
      </CForm>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </CModalBody>
    <CModalBody v-else>
      Are you sure you want to delete this Machine with ID : {{ idMachine }}, Machine Address : {{ machineAddress }}, Actual Shot : {{ actualShot }}, Limit Shot : {{ limitShot }} ?
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" variant="outline" @click="$emit('close')">
        Close
      </CButton>
      <CButton variant="outline" 
      :color="mode === 'update' ? 'primary' : mode === 'delete' ? 'danger' : 'success'" 
      @click="mode === 'update' ? updateMachine() : mode === 'delete' ? deleteMachine() : addMachine()"
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
  name: 'ModalMachine',
  
  props: {
    visible: Boolean,
    item: Object,
    eventTable: Object,
  },

  setup(props) {
    const idMachine = ref('');
    const actualShot = ref(0)
    const limitShot = ref(0)
    const shift = ref('');
    const machineAddress = ref('');
    const errorMessage = ref('');
    const mode = ref('create'); // Default mode is 'create'

    

    watch(() => props.item, (newValue) => {
      if (newValue) {
        idMachine.value = newValue.id_machine;
        actualShot.value = newValue.actual_shot;
        shift.value = newValue.shift;
        limitShot.value = newValue.limit_shot
        machineAddress.value = newValue.address;
        if (newValue.mode === 'delete') {
          mode.value = 'delete'; // Set the mode to 'delete' when item is provided for delete operation
        } else {
          mode.value = 'update'; // Set the mode to 'update' when item is provided for update operation
        }
      } else {
        idMachine.value = '';
        machineAddress.value = '';
        mode.value = 'create'; // Set the mode to 'create' when item is not provided
      }
    });

    const resetForm = () => {
      idMachine.value = '';
      actualShot.value = 0;
      limitShot.value= 0;
      shift.value = '';
      machineAddress.value = ''
    }

    const addMachine = async () => {
      try {
        const response = await axios.post('http://192.168.148.125:5000/machine', {
          id_machine: idMachine.value,
          address: machineAddress.value,
        });
        props.eventTable.refreshMachine = true
        resetForm()
      } catch (error) {
        console.error(error);
        errorMessage.value = error.response.data.message;
      }
    }

    const updateMachine = async () => {
      try {
        const response = await axios.patch(`http://192.168.148.125:5000/machine/${idMachine.value}`, {
          limit_shot: limitShot.value,
          actual_shot: actualShot.value,
          shift: shift.value,
          address: machineAddress.value,
        });
        props.eventTable.refreshMachine = true;
        resetForm()
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    const deleteMachine = async () => {
      try {
        const response = await axios.delete(`http://192.168.148.125:5000/machine/${idMachine.value}`);
        props.eventTable.refreshMachine = true;
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    return { 
      idMachine,
      limitShot,
      actualShot,
      shift,
      machineAddress,
      errorMessage,
      mode,
      addMachine,
      updateMachine,
      deleteMachine
    }
  }
}
</script>
