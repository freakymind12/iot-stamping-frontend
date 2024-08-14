<template>
  <CModal
    :visible="props.visible"
    @close="$emit('close')"
    aria-labelledby="LiveDemoExampleLabel"
    alignment="center"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">{{ title }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CInputGroup class="mb-2">
          <CFormInput
            type="password"
            v-model="password.oldPassword"
            floatingLabel="Current Password"
            placeholder="********"
            aria-describedby="exampleFormControlInputHelpInline"
            size="sm"
          />
        </CInputGroup>
        <CInputGroup class="mb-2">
          <CFormInput
            type="password"
            v-model="password.newPassword"
            floatingLabel="New Password"
            placeholder="********"
            aria-describedby="exampleFormControlInputHelpInline"
            size="sm"
          >
            <template #text v-if="password.newPassword.length < 8">
              Must be 8-20 characters long.
            </template>
          </CFormInput>
        </CInputGroup>
      </CForm>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" variant="outline" @click="$emit('close')"> Close </CButton>
      <CButton color="primary" @click="changePassword">Save changes</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref } from 'vue'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useRouter } from 'vue-router';

// Mendefinisikan props untuk komponen modal
const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Modal Title',
  },
  body: {
    type: String,
    default: 'Modal Body',
  },
})

const emit = defineEmits(['close','success'])

// Menggunakan ref untuk menyimpan nilai password dan pesan error
const password = ref({
  oldPassword: '',
  newPassword: '',
})
const errorMessage = ref('')
const router = useRouter()

const sucessChangePassword = () => {
  emit('close')
  emit('success')
}

// Fungsi untuk mengganti password
const changePassword = async () => {
  // Validasi input password
  if (!password.value.oldPassword || !password.value.newPassword) {
    errorMessage.value = 'Both old password and new password are required.'
    return
  }

  if (password.value.newPassword.length < 8) {
    errorMessage.value = 'New password must be at least 8 characters long.'
    return
  }

  if (password.value.newPassword === password.value.oldPassword){
    errorMessage.value = 'New password cannot be the same as the previous one'
    return
  }

  try {
    const token = Cookies.get('jwt_token') // Mengambil token JWT dari cookies

    // Mengirim permintaan PATCH dengan body
    const response = await axios.patch(
      'http://192.168.148.125:5000/users/password',
      {
        old_password: password.value.oldPassword,
        new_password: password.value.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    console.log(response.data) // Menampilkan data respons
    password.value.oldPassword = ''
    password.value.newPassword = ''
    sucessChangePassword()
    setTimeout(() => {
      Cookies.remove('jwt_token')
      router.push('/login')
    }, 3000)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message)
    errorMessage.value = 'An error occurred while changing the password.'
  }
}

</script>

<style>
.error {
  color: red;
}
</style>
