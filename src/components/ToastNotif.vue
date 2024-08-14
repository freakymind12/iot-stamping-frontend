<template>
  <div v-if="toastVisible">
    <CToaster class="p-3" :placement=placement>
      <CToast :autohide="true" :color="color" class="text-white align-items-center" visible :delay="delay">
        <div class="d-flex">
          <CToastBody>
              {{ body }}
            <slot name="spinner" >
            </slot>
          </CToastBody>
          <CToastClose class="me-2 m-auto" white />
        </div>
      </CToast>
    </CToaster>
  </div>
</template>

<script>

export default {
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    body: {
      type: String,
      default: ''
    },
    toastVisible: {
      type: Boolean,
      default: false
    },
    delay:{
      type: Number,
      default: 5000
    },
    placement:{
      type: String,
      default: 'top-end'
    }
  }
};
</script>