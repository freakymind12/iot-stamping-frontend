<template>

  <CModal 
    :visible="visible"
    @close="$emit('close')"
    aria-labelledby="LiveDemoExampleLabel"
    alignment="center"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">{{ mode === 'update' ? 'Edit' : mode === 'delete' ? 'Delete' : 'Add' }} Kanagata Data</CModalTitle>
    </CModalHeader>
    <CModalBody v-if="mode !== 'delete'">
      <CForm>
        <CFormInput
          type="text"
          id="idKanagata"
          label="ID Kanagata"
          placeholder="ID Kanagata"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="idKanagata"
          class="form-input"
          :disabled="mode === 'update'"
          required
        />
        <CFormInput
          type="number"
          id="actualShot"
          label="Actual Shot Kanagata"
          placeholder="Actual Shot Kanagata"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="actualShot"
          class="form-input"
        />
        <CFormInput
          type="number"
          id="limitShot"
          label="Limit Shot Kanagata"
          placeholder="Limit Shot Kanagata"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="limitShot"
          class="form-input"
        />
        <CFormInput
          type="number"
          id="cavity"
          label="Cavity"
          placeholder="Number of cavities"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="cavity"
          class="form-input"
        />
      </CForm>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </CModalBody>
    <CModalBody v-else>
      Are you sure you want to delete this kanagata with ID : {{ idKanagata }}, Actual Shot : {{ actualShot }}, Limit Shot : {{ limitShot }} ?
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" variant="outline" @click="$emit('close')">
        Close
      </CButton>
      <CButton variant="outline"
      :color="mode === 'update' ? 'primary' : mode === 'delete' ? 'danger' : 'success'" 
      @click="mode === 'update' ? updateKanagata() : mode === 'delete' ? deleteKanagata() : addKanagata()"
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
  name: 'ModalKanagata',
  
  props: {
    visible: Boolean,
    item: Object,
    eventTable: Object,
  },

  setup(props) {
    const idKanagata = ref('');
    const actualShot = ref(0);
    const limitShot = ref(0);
    const errorMessage = ref('');
    const cavity = ref(0)
    const mode = ref('create'); // Default mode is 'create'

    watch(() => props.item, (newValue) => {
      if (newValue) {
        idKanagata.value = newValue.id_kanagata;
        actualShot.value = newValue.actual_shot;
        limitShot.value = newValue.limit_shot;
        cavity.value = newValue.cavity;
        if (newValue.mode === 'delete') {
          mode.value = 'delete'; // Set the mode to 'delete' when item is provided for delete operation
        } else {
          mode.value = 'update'; // Set the mode to 'update' when item is provided for update operation
        }
      } else {
        idKanagata.value = '';
        actualShot.value = 0;
        limitShot.value = 0;
        cavity.value = 0;
        mode.value = 'create'; // Set the mode to 'create' when item is not provided
      }
    });

    const resetForm = () => {
      idKanagata.value = '';
      actualShot.value = 0;
      limitShot.value= 0;
      cavity.value=0
    }

    const addKanagata = async () => {
      try {
        const response = await axios.post('http://192.168.148.125:5000/kanagata', {
          id_kanagata: idKanagata.value,
          actual_shot: actualShot.value,
          limit_shot: limitShot.value,
          cavity: cavity.value
        });
        props.eventTable.refreshKanagata = true;
        resetForm()
        // console.log(response.data);
        // window.location.reload();
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    const updateKanagata = async () => {
      try {
        const response = await axios.patch(`http://192.168.148.125:5000/kanagata/${idKanagata.value}`, {
          id_kanagata: idKanagata.value,
          actual_shot: actualShot.value,
          limit_shot: limitShot.value,
          cavity: cavity.value
        });
        props.eventTable.refreshKanagata = true;
        resetForm()
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    const deleteKanagata = async () => {
      try {
        const response = await axios.delete(`http://192.168.148.125:5000/kanagata/${idKanagata.value}`);
        props.eventTable.refreshKanagata = true;
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    return { 
      idKanagata,
      actualShot,
      limitShot,
      errorMessage,
      mode,
      cavity,
      addKanagata,
      updateKanagata,
      deleteKanagata
    }
  }
}
</script>

