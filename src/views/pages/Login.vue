<template>
  <div class="login-page">
    <video autoplay muted loop id="bg-video">
      <source src="@/assets/videos/register.mp4" type="video/mp4" />
      Your browser does not support HTML5 video.
    </video>
    <div class="login-content min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <CCol :md="8">
            <CCardGroup>
              <CCard class="p-4">
                <CCardBody>
                  <CForm>
                    <CImage
                      custom-class-name="sidebar-brand-full"
                      :src="hrs"
                      :height="58"
                      style="margin-bottom: 0.5rem"
                    />
                    <p class="text-body-secondary">Sign In to your account</p>
                    <CInputGroup class="mb-3">
                      <CInputGroupText>
                        <CIcon icon="cil-user" />
                      </CInputGroupText>
                      <CFormInput
                        v-model="email"
                        type="email"
                        placeholder="E-mail"
                        floatingLabel="E-mail"
                      />
                    </CInputGroup>
                    <CInputGroup class="mb-4">
                      <CInputGroupText>
                        <CIcon icon="cil-lock-locked" />
                      </CInputGroupText>
                      <CFormInput
                        v-model="password"
                        type="password"
                        placeholder="Password"
                        floatingLabel="Password"
                        @keyup.enter="login()"
                      />
                    </CInputGroup>
                    <CRow v-if="errorMessage">
                      <p class="error-message">{{ errorMessage }}</p>
                    </CRow>
                    <CRow>
                      <CCol :xs="6">
                        <CButton color="primary" class="px-4" @click="login()"> Login </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard class="text-white bg-primary py-5" style="width: 44%">
                <CCardBody
                  class="d-flex justify-content-center align-items-center"
                  style="height: 100%"
                >
                  <div class="text-center">
                    <h1>Sign up</h1>
                    <p>Tell developer for new access account to this site. or hit button bellow to register by your self</p>
                      <CButton color="light" variant="outline" class="mt-2 custom-button" disabled @click="register()">
                        Register Now!
                      </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import hrs from '@/assets/images/hrs.png'

export default {
  name: 'Login',
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const errorMessage = ref('')

    const login = async () => {
      try {
        const response = await axios.post(
          'http://192.168.148.125:5000/auth/login',
          {
            email: email.value,
            password: password.value,
          },
          // {
          //   withCredentials: true, // Ensure cookies are sent and received
          // },
        )

        // Handle respons dari API jika login berhasil
        // this.token = response.data.token
        Cookies.set('jwt_token', response.data.token, { expires: 24, sameSite: 'lax' })
        // Contoh: redirect ke halaman dashboard jika login berhasil
        router.push('/live_dashboard')
      } catch (error) {
        // Handle error jika login gagal
        errorMessage.value = error.response.data.message || 'An error occurred during login.'
        console.error(error)
      }
    }

    const register = () => {
      router.push('/register')
    }
    return {
      email,
      password,
      login,
      errorMessage,
      hrs,
      register,
    }
  },
}
</script>

<style scoped>
.bg-login {
  background-image: url('@/assets/images/waves.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

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
