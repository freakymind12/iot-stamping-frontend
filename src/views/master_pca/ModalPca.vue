<template>

  <CModal 
    :visible="visible"
    @close="$emit('close')"
    aria-labelledby="LiveDemoExampleLabel"
    alignment="center"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">{{ mode === 'update' ? 'Edit' : mode === 'delete' ? 'Delete' : 'Register' }} PCA Data</CModalTitle>
    </CModalHeader>
    <CModalBody v-if="mode !== 'delete'">
      <CForm>
        <CFormSelect
          id="idMachine"
          label="ID Machine"
          size="sm"
          v-model="idMachine"
          class="form-input"
          :options="machineOptions"
        />
        <CFormSelect
          id="idKanagata"
          label="ID Kanagata"
          size="sm"
          v-model="idKanagata"
          class="form-input"
          :options="kanagataOptions"
        />
        <CFormSelect
          id="idProduct"
          label="Product"
          size="sm"
          v-model="idProduct"
          class="form-input"
          :options="productOptions"
        />
        <CFormInput
          type="number"
          id="speed"
          label="Stamping Per Minutes"
          placeholder="Stamp per minutes"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="speed"
          class="form-input"
        />
        
      </CForm>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </CModalBody>
    <CModalBody v-else>
      <div>
        Are you sure you want to delete this PCA data with ID Machine : {{ idMachine }}, ID Kanagata : {{ idKanagata }}, DP Code : {{ idProduct }}, SPM : {{ speed }} ?
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" variant="outline" @click="$emit('close')">
        Close
      </CButton>
      <CButton variant="outline"
      :color="mode === 'update' ? 'primary' : mode === 'delete' ? 'danger' : 'success'" 
      @click="mode === 'update' ? updatePca() : mode === 'delete' ? deletePca() : addPca()"
      >
        {{ mode === 'update' ? 'Update' : mode === 'delete' ? 'Delete' : 'Save' }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'ModalPca',
  
  props: {
    visible: Boolean,
    item: Object,
    eventTable: Object,
  },

  setup(props) {
    const machineOptions = ref([]);
    const kanagataOptions = ref([]);
    const productOptions = ref([]);
    const idPca = ref('')
    const idMachine = ref('');
    const idKanagata = ref('');
    const idProduct = ref('');
    const speed = ref(0)
    const errorMessage = ref('');
    const mode = ref('create');

    watch(() => props.item, (newValue) => {
      if (newValue) {
        idPca.value = newValue.id_pca
        idMachine.value = newValue.id_machine;
        idKanagata.value = newValue.id_kanagata;
        idProduct.value = newValue.id_product;
        speed.value = newValue.speed;
        if (newValue.mode === 'delete') {
          mode.value = 'delete'; // Set the mode to 'delete' when item is provided for delete operation
        } else {
          mode.value = 'update'; // Set the mode to 'update' when item is provided for update operation
        }
      } else {
        idMachine.value = '';
        idKanagata.value = '';
        idProduct.value = '';
        speed.value = 0;
        mode.value = 'create'; // Set the mode to 'create' when item is not provided
      }
    });

    const resetForm = () => {
      idKanagata.value=''
      idProduct.value=''
      speed.value=0
      idMachine.value=''
    }

    // method fetching data untuk select form
    const fetchOptionsData = async (endpoint, labelProp, valueProp) => {
      try {
        const response = await axios.get(endpoint);
        const data = response.data.data;
        const options = data.map(item => ({
          label: item[labelProp], // Gunakan properti label yang dinamis
          value: item[valueProp] // Gunakan properti value yang dinamis
        }));
        return [
          { label: 'Open this select menu', value: '' },
          ...options
        ];
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        return []; // Mengembalikan array kosong jika terjadi kesalahan
      }
    };

    // ketika onmounted komponen lakukan perintah ini
    onMounted(async () => {
      machineOptions.value = await fetchOptionsData('http://192.168.148.125:5000/machine', 'id_machine', 'id_machine');
      kanagataOptions.value = await fetchOptionsData('http://192.168.148.125:5000/kanagata', 'id_kanagata', 'id_kanagata');
      productOptions.value = await fetchOptionsData('http://192.168.148.125:5000/product', 'name', 'id_product');
    });


    // method untuk crud 
    const addPca = async () => {
      try {
        const response = await axios.post('http://192.168.148.125:5000/pca', {
          id_machine: idMachine.value,
          id_kanagata: idKanagata.value,
          id_product: idProduct.value,
          speed: speed.value,
        });
        props.eventTable.refreshPca = true
        resetForm()
        // console.log(response.data);
        // window.location.reload();
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    const updatePca = async () => {
      try {
        const response = await axios.patch(`http://192.168.148.125:5000/pca/${idPca.value}`, {
          id_machine: idMachine.value,
          id_kanagata: idKanagata.value,
          id_product: idProduct.value,
          speed: speed.value,
        });
        props.eventTable.refreshPca = true
        resetForm()
        // console.log(response.data);
        // window.location.reload();
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    const deletePca = async () => {
      try {
        const response = await axios.delete(`http://192.168.148.125:5000/pca/${idPca.value}`);
        props.eventTable.refreshPca = true
        // console.log(response.data);
        // window.location.reload();
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    return {
      idMachine,
      idKanagata,
      idProduct,
      speed,
      errorMessage,
      mode,
      addPca,
      updatePca,
      deletePca,
      machineOptions,
      kanagataOptions,
      productOptions
    }
  }
}
</script>


