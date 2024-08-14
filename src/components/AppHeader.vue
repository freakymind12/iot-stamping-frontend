<template>
  <CHeader position="sticky" :class="headerClassNames">
    <CContainer class="border-bottom px-4" fluid>
      <CHeaderToggler @click="$store.commit('toggleSidebar')" style="margin-inline-start: -14px">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <AppBreadcrumb />
      <CHeaderNav class="ms-auto">
        <CNavItem>
          <ClockCount />
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <CDropdown variant="nav-item" placement="bottom-end">
          <CDropdownToggle :caret="false">
            <CIcon v-if="colorMode === 'dark'" icon="cil-moon" size="lg" />
            <CIcon v-else-if="colorMode === 'light'" icon="cil-sun" size="lg" />
            <CIcon v-else icon="cil-contrast" size="lg" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              :active="colorMode === 'light'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('light')"
            >
              <CIcon class="me-2" icon="cil-sun" size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'dark'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('dark')"
            >
              <CIcon class="me-2" icon="cil-moon" size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'auto'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('auto')"
            >
              <CIcon class="me-2" icon="cil-contrast" size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <div
          style="display: flex; text-align: center; align-items: center"
          class="rounded-rectangle"
          :style="{ backgroundColor:backgroundColor }"
        >
          {{ capitalizeEachWord(role) }}
        </div>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <AppHeaderDropdownAccnt @open-modal="openModal" />
      </CHeaderNav>
    </CContainer>
    <!-- <CContainer class="px-4" fluid> -->
    <!-- <AppBreadcrumb /> -->
    <!-- </CContainer> -->
    <ModalChangePassword
      :visible="modalChangePassword.visible"
      @close="closeModal"
      :title="modalChangePassword.title"
      @success="handleToast"
    />
  </CHeader>
  <ToastNotif
    :color="toastData.color"
    :body="toastData.body"
    :toastVisible="toastData.visible"
    :placement="toastData.placement"
  >
    <template #spinner>
      <CSpinner size="sm" />
    </template>
  </ToastNotif>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useColorModes } from '@coreui/vue'
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import ClockCount from './ClockCount'
import checkRoles from '../middleware/CheckRoles'
import ModalChangePassword from './ModalChangePassword.vue'
import ToastNotif from './ToastNotif.vue'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
    ClockCount,
    ModalChangePassword,
    ToastNotif,
  },
  setup() {
    const headerClassNames = ref('mb-4 p-0')
    const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')
    const role = ref('')
    const colorRole = {
      admin: '#008585',
      viewer: '#c45161',
      staff: '#808080',
    }
    const toastData = ref({})

    const capitalizeEachWord = (str) => {
      return str.replace(/\b\w/g, (char) => char.toUpperCase())
    }

    const backgroundColor = computed(() => {
      return colorRole[role.value]
    })

    const modalChangePassword = ref({
      visible: false,
      title: 'Change Account Password',
    })

    const openModal = () => {
      modalChangePassword.value.visible = true
    }

    const closeModal = () => {
      modalChangePassword.value.visible = false
    }

    const handleToast = () => {
      toastData.value.color = 'success'
      toastData.value.body = 'Success change password, redirect you to login page'
      toastData.value.visible = true
      toastData.value.placement = 'top-end'
    }

    onMounted(async () => {
      document.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 0) {
          headerClassNames.value = 'mb-4 p-0 shadow-sm'
        } else {
          headerClassNames.value = 'mb-4 p-0'
        }
      })
      try {
        role.value = await checkRoles()
        console.log(role.value)
      } catch (error) {
        console.error(error)
      }
    })

    return {
      headerClassNames,
      colorMode,
      setColorMode,
      role,
      backgroundColor,
      capitalizeEachWord,
      modalChangePassword,
      openModal,
      closeModal,
      handleToast,
      toastData,
    }
  },
}
</script>

<style scoped>
.rounded-rectangle {
  display: inline-block;
  color: white;
  padding: 12px 10px;
  border-radius: 5px;
  font-size: 11px;
  text-align: center;
  transition: background-color 0.3s ease;
}
</style>
