<template>
  <CModal alignment="center" :visible="visible" @close="handleClose">
    <CModalHeader>
      <CModalTitle
        >{{ mode === 'update' ? 'Edit' : mode === 'delete' ? 'Delete' : 'Add' }} Planing
        Production</CModalTitle
      >
    </CModalHeader>
    <CModalBody>
      <CForm>
        <CFormSelect
          label="PCA Data"
          :options="pcaOptions"
          class="form-input"
          size="sm"
          v-model="idPca"
          :disabled="mode === 'delete' || stateDate === false"
        />
        <CRow>
          <CCol>
            <CFormInput
              type="text"
              id="qty"
              label="Quantity"
              placeholder="Quantity"
              aria-describedby="exampleFormControlInputHelpInline"
              size="sm"
              class="form-input"
              v-model="qty"
              :disabled="mode === 'delete'"
            />
          </CCol>
          <CCol>
            <CFormSelect
              label="Shift"
              :options="[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
              ]"
              class="form-input"
              size="sm"
              v-model="shift"
              :disabled="mode === 'delete' || stateDate === false"
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <div>
              <label for="date-picker" style="display: block; margin-bottom: 0.5rem">
                Production Start Time
              </label>
              <VueDatePicker
                id="date-picker"
                v-model="dateStart"
                :enable-time-picker="false"
                vertical
                placeholder="Select Time"
                style="margin-bottom: 1rem"
                :format="formatDate"
                :disabled="mode === 'delete' || stateDate === false"
              />
            </div>
          </CCol>
          <CCol>
            <div>
              <label for="date-picker" style="display: block; margin-bottom: 0.5rem">
                Production End Time
              </label>
              <VueDatePicker
                v-model="dateEnd"
                :enable-time-picker="false"
                vertical
                placeholder="Select Time"
                style="margin-bottom: 1rem"
                :format="formatDate"
                :disabled="mode === 'delete' || stateDate === false"
              />
            </div>
          </CCol>
        </CRow>
      </CForm>
      <p
        v-if="mode === 'delete' && errorMessage === null"
        style="font-weight: 400; color: red; font-size: small"
      >
        Note : Are you sure want to delete this production plan ?
      </p>
      <p v-if="errorMessage" style="font-size: small; color: red">Error : {{ errorMessage }}</p>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="handleClose" variant="outline" shape="rounded-pill"
        >Close</CButton
      >
      <CButton
        variant="outline"
        shape="rounded-pill"
        :color="mode === 'update' ? 'primary' : mode === 'delete' ? 'danger' : 'success'"
        @click="mode === 'update' ? updatePlan() : mode === 'delete' ? deletePlan() : addPlan()"
        :disabled="mode === 'delete' && stateDate === false"
      >
        {{ mode === 'update' ? 'Update' : mode === 'delete' ? 'Delete' : 'Save' }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['close'])
const mode = ref('create')
const pcaOptions = ref([])
const dateStart = ref(new Date())
dateStart.value.setHours(7,0,0,0)
const dateEnd = ref(new Date())
dateEnd.value.setHours(19,0,0,0)
const idPca = ref('11')
const idPlan = ref(null)
const qty = ref(0)
const shift = ref('1')
const errorMessage = ref(null)
const stateDate = ref(true)
const validationDate = ref(true)

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  item: Object,
  eventTable: Object,
})

// modal state watcher
watch(
  () => props.item,
  (newValue) => {
    if (newValue) {
      idPlan.value = newValue.id_plan
      if (newValue.mode === 'delete') {
        mode.value = 'delete'
        fetchPlanData(newValue.id_plan)
      } else {
        mode.value = 'update'
        fetchPlanData(newValue.id_plan)
      }
    } else {
      mode.value = 'create'
    }
  },
)

// shift watcher
watch(shift, (newShift) => {
  if (newShift === '1') {
    // Manipulasi dateStart dan dateEnd untuk shift 1
    let startDate = new Date(dateStart.value)
    startDate.setHours(7, 0, 0, 0)

    let endDate = new Date(dateStart.value)
    endDate.setHours(19, 0, 0, 0) 

    dateStart.value = startDate
    dateEnd.value = endDate
  } else if(newShift == '2'){
    let startDate = new Date(dateStart.value)
    startDate.setHours(19, 0, 0, 0)

    let endDate = new Date(dateStart.value)
    endDate.setDate(startDate.getDate() + 1)
    endDate.setHours(7, 0, 0, 0) 

    dateStart.value = startDate
    dateEnd.value = endDate
  }
})

// datestart, dateend  watcher untuk update plan
watch([dateStart, dateEnd], ([newStart, newEnd]) => {
  const now = new Date()
  if(newStart < now || newEnd < now || newEnd < newStart){
    validationDate.value = false
  }
  else if(newStart > newEnd || newEnd > newStart){
    validationDate.value = true
  }
})

onMounted(async () => {
  pcaOptions.value = await fetchPcaData()
})

const handleClose = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  qty.value = 0
  shift.value = 1
  dateStart.value = new Date()
  dateEnd.value = new Date()
  dateStart.value.setHours(7,0,0,0)
  dateEnd.value.setHours(19,0,0,0)
  idPca.value = 11
  idPlan.value = null
  errorMessage.value = null
  stateDate.value = true
  validationDate.value=true
}

const addPlan = async () => {
  try {
    // eslint-disable-next-line no-unused-vars
    const isDateValid = await checkingDate(dateStart.value, dateEnd.value, 'add')

    if (!isDateValid) {
      errorMessage.value =
        'Production start or end times have passed, or the end time of production must not be below the start time of production'
      console.error(errorMessage.value)
      return
    }

    await axios.post('http://192.168.148.125:5000/plan', {
      id_pca: idPca.value,
      qty: qty.value,
      shift: shift.value,
      date_start: formatDate(dateStart.value),
      date_end: formatDate(dateEnd.value),
    })
    // eslint-disable-next-line vue/no-mutating-props
    props.eventTable.refreshPlan = true
    resetForm()
  } catch (error) {
    errorMessage.value = error.response.data.message
    console.error(error)
  }
}

const updatePlan = async () => {
  // if(!validationDate.value){
  //   errorMessage.value = ''
  //   return
  // }
  try {
    await axios.patch(`http://192.168.148.125:5000/plan/${idPlan.value}`, {
      id_pca: idPca.value,
      qty: qty.value,
      shift: shift.value,
      start: formatDate(dateStart.value),
      end: formatDate(dateEnd.value),
    })
    // eslint-disable-next-line vue/no-mutating-props
    props.eventTable.refreshPlan = true
    resetForm()
  } catch (error) {
    errorMessage.value = error.response.data.message
    console.error(error)
  }
}

const deletePlan = async () => {
  try {
    // eslint-disable-next-line no-unused-vars
    const response = await axios.delete(`http://192.168.148.125:5000/plan/${idPlan.value}`)
    // eslint-disable-next-line vue/no-mutating-props
    props.eventTable.refreshPlan = true
    resetForm()
  } catch (error) {
    errorMessage.value = error.response.data.message
    console.error(error)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// fetching option for PCA data
const fetchPcaData = async () => {
  try {
    const response = await axios.get(`http://192.168.148.125:5000/pca`)
    const data = response.data.data
    const options = data.map((item) => ({
      label: item.id_machine + ' | ' + item.name + ' | ' + item.id_kanagata,
      value: item.id_pca,
    }))
    return options
  } catch (error) {
    console.error(`Error fetching PCA data`, error)
    return []
  }
}

// fetching for update and delete
const fetchPlanData = async (id_plan) => {
  try {
    const response = await axios.get(`http://192.168.148.125:5000/plan?id_plan=${id_plan}`)
    const data = response.data.data[0]
    idPca.value = data.id_pca
    shift.value = data.shift
    qty.value = data.qty
    dateStart.value = data.start
    dateEnd.value = data.end

    const isDateValid = await checkingDate(dateStart.value, dateEnd.value)

    if (!isDateValid) {
      stateDate.value = false
    }
  } catch (error) {
    console.error('Error fetching plan data', error)
  }
}

// validasi tanggal plan production
const checkingDate = (start, end, process = '') => {
  const now = new Date()
  const startDate = new Date(start)
  const endDate = new Date(end)

  // Membuat objek tanggal tanpa waktu
  const nowDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
  )
  const startOnlyDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    startDate.getHours(),
    startDate.getMinutes(),
  )
  const endOnlyDate = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
    endDate.getHours(),
    endDate.getMinutes(),
  )

  if (process === 'add') {
    if (endOnlyDate < startOnlyDate) {
      return false
    }
  }

  // Memeriksa apakah tanggal saat ini berada dalam rentang atau belum dimulai
  if (nowDate <= startOnlyDate && nowDate <= endOnlyDate) {
    return true // Rentang waktu belum terlewat
  } else {
    return false // Rentang waktu sudah terlewat
  }
}

</script>
