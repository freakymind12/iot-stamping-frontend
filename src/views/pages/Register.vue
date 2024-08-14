<template>
  <div class="login-page">
    <video autoplay muted loop id="bg-video">
      <source src="@/assets/videos/register.mp4" type="video/mp4">
      Your browser does not support HTML5 video.
    </video>
    <div class="login-content min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <CCol :md="9" :lg="7" :xl="6">
            <CCard class="mx-4">
              <CCardBody class="p-4">
                <CForm 
                  @submit="newUser"
                  novalidate
                  :validated="validateForm"
                >
                  <CImage :src="hrs" :height="58" style="margin-bottom: .5rem;" align="center"/> 
                  <h5 style="text-align: center; margin-bottom: .5rem;">Register an Account</h5>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Username" 
                      autocomplete="username" 
                      v-model="username" 
                      required
                      feedbackInvalid="Please choose a username."
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cib-gmail"/>
                    </CInputGroupText>
                    <CFormInput 
                      type="email"
                      placeholder="Email" 
                      autocomplete="email" 
                      v-model="email" 
                      required
                      feedbackInvalid="Please enter a valid email address."
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="new-password"
                      v-model="password"
                      required
                      feedbackInvalid="Make a strong password"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autocomplete="new-password"
                      v-model="repeatPassword"
                      required
                      feedbackInvalid="Passwords do not match. Please try again"
                    />
                  </CInputGroup>
                  <div class="d-grid">
                    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
                    <CButton color="success" type="submit" class="regist-button">Create Account</CButton>
                    <CButton color="primary" @click="toLogin">Back To Login Page</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <ToastNotif :color="toastColor" :body="toastBody" :toastVisible="toastVisible" placement="top-end" :dissmisible="false"/>
      </CContainer>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import hrs from '@/assets/images/hrs.png';
import ToastNotif from '@/components/ToastNotif.vue';

const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const repeatPassword = ref('');
const validateForm = ref(null);
const toastColor = ref('')
const toastBody = ref('')
const toastVisible = ref(false)

const newUser = async (event) => {
  if (password.value !== repeatPassword.value) {
    errorMessage.value = "Password and repeat password do not match.";
    return;
  }

  const form = event.currentTarget;
  console.log(form);
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  }

  validateForm.value = true;

  try {
    const response = await axios.post('http://192.168.148.125:5000/users/signup', {
      username: username.value,
      email: email.value,
      password: password.value
    });
    console.log(response.data);
    showToast('success', 'Registration success wait we will redirect you to login page')
    setTimeout(() => {
      toLogin();
    }, 3000);
  } catch (error) {
    if (Array.isArray(error.response.data.message)) {
      errorMessage.value = error.response.data.message[0].msg;
    } else {
      errorMessage.value = error.response.data.message;
    }
    console.error(error);
  }
};

const toLogin = () => {
  router.push('/login');
};

const showToast = (color, body) => {
  toastVisible.value = true
  toastColor.value= color
  toastBody.value= body
  setTimeout(() => {
    toastVisible.value = false;
  }, 3000);
}
</script>

<style scoped>
.regist-button{
  margin-bottom: 1rem;
}

/* .bg-login{
  background-image: url('@/assets/images/waves.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
} */

.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.error-message {
  font-size: small;
  color: red;
}
</style>