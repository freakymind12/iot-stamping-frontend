<template>
  <div class="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <span class="clearfix">
            <h1>403</h1>
            <h4>Guard, we have a problem!</h4>
            <p class="text-body-secondary float-start">
              It's Guarded by an Authorized Personnel Only. Please contact developer for grant an access
            </p>
          </span>
          <router-link to="/live_dashboard">
            <CButton color="primary">Back to dashboard</CButton>
          </router-link>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Page403',
}
</script>
