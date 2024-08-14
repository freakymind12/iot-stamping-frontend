<template>
  <CModal 
    :visible="visible"
    @close="$emit('close')"
    aria-labelledby="LiveDemoExampleLabel"
    alignment="center"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">{{ mode === 'update' ? 'Edit' : mode === 'delete' ? 'Delete' : 'Add' }} Product Data</CModalTitle>
    </CModalHeader>
    <CModalBody v-if="mode !== 'delete'">
      <CForm>
        <CFormInput
          type="text"
          id="idProduct"
          label="DP Code"
          placeholder="DP Code"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="idProduct"
          class="form-input"
          :disabled="mode === 'update'"
        />
        <CFormInput v-if="mode === 'update'"
          type="text"
          id="newIdProduct"
          label="New DP Code"
          placeholder="New DP Code"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="newIdProduct"
          class="form-input"
        />
        <CFormInput
          type="text"
          id="name"
          label="Product Name"
          placeholder="Product Name"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="productName"
          class="form-input"
        />
        <CFormInput
          type="text"
          id="price"
          label="Price (Rp)"
          placeholder="Price per pin"
          aria-describedby="exampleFormControlInputHelpInline"
          size="sm"
          v-model="priceProduct"
          class="form-input"
        />
      </CForm>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </CModalBody>
    <CModalBody v-else>
      Are you sure you want to delete this product with DP Code : {{ idProduct }}, Product Name : {{ productName }} ?
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" variant="outline" @click="$emit('close')">
        Close
      </CButton>
      <CButton variant="outline"
      :color="mode === 'update' ? 'primary' : mode === 'delete' ? 'danger' : 'success'" 
      @click="mode === 'update' ? updateProduct() : mode === 'delete' ? deleteProduct() : addProduct()"
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
  name: 'ModalProduct',
  
  // props untuk komponen, didapat dari parent component
  props: {
    visible: Boolean,
    item: Object,
    eventTable: Object,
  },

  setup(props) {
    const idProduct = ref('');
    const productName = ref('');
    const errorMessage = ref('');
    const newIdProduct = ref('')
    const priceProduct = ref(0)
    // const oldIdProduct = ref('')
    const mode = ref('create'); // Default mode is 'create'

    watch(() => props.item, (newValue, oldValue) => {
      console.log('Data Changed, New Value :', newValue, 'Old Value :', oldValue)
      if (newValue) {
        idProduct.value = newValue.id_product;
        productName.value = newValue.name;
        priceProduct.value = newValue.price;
        if (newValue.mode === 'delete') {
          mode.value = 'delete'; // Set the mode to 'delete' when item is provided for delete operation
        } else {
          mode.value = 'update'; // Set the mode to 'update' when item is provided for update operation
        }
      } else {
        idProduct.value = '';
        productName.value = '';
        priceProduct.value = 0;
        mode.value = 'create'; // Set the mode to 'create' when item is not provided
      }
  });

    const resetForm = () => {
      idProduct.value = '';
      productName.value = '';
      newIdProduct.value= '';
      priceProduct.value = 0;
    }

    const addProduct = async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.post('http://192.168.148.125:5000/product', {
          id_product: idProduct.value,
          name: productName.value,
          price: priceProduct.value
        });
        // eslint-disable-next-line vue/no-mutating-props
        props.eventTable.refreshProduct = true;
        resetForm()
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    const updateProduct = async () => {
      try {
        const response = await axios.patch(`http://192.168.148.125:5000/product/${idProduct.value}`, {
          id_product : newIdProduct.value,
          name: productName.value,
          price: priceProduct.value
        });
        props.eventTable.refreshProduct = true;
        resetForm()
        // console.log(response.data);
        // window.location.reload();
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    const deleteProduct = async () => {
      try {
        const response = await axios.delete(`http://192.168.148.125:5000/product/${idProduct.value}`);
        console.log(response.data.message);
        props.eventTable.refreshProduct = true;
        // window.location.reload();
      } catch (error) {
        errorMessage.value = error.response.data.message;
        console.error(error);
      }
    }

    return { 
      idProduct,
      newIdProduct,
      priceProduct,
      productName,
      errorMessage,
      mode,
      addProduct,
      updateProduct,
      deleteProduct
    }
  }
}
</script>
