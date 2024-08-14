import {ref} from 'vue'

const eventTable = ref({
  refreshProduct : false,
  refreshPca : false,
  refreshMachine : false,
  refreshKanagata : false,
  refreshProduction : false,
  refreshPlan : false,
})

export default eventTable