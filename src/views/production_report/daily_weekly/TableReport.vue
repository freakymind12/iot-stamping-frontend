  <template>
    <CCol>
      <CAccordion :active-item-key="1" always-open>
        <CAccordionItem :item-key="1">
          <CAccordionHeader>
            <div style="font-size: medium; font-weight: 700;">Table List Data</div>
          </CAccordionHeader>
          <CAccordionBody>
            <vue3-datatable class="mini-table" :rows="rows" :columns="cols" :sortable="true" skin="bh-table-striped bh-table-hover bh-table-bordered bh-table-compact" pageSize="3" :showPageSize="false"/>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </CCol>
  </template>

  <script setup>
  import Vue3Datatable from '@bhplugin/vue3-datatable';
  import '@bhplugin/vue3-datatable/dist/style.css';
  const props = defineProps({
    data : Array,
    rows : Array,
    cols : Array
  });
  </script>

  <style >
  .bh-table-responsive table.bh-table-compact tbody tr td,
  .bh-table-responsive table.bh-table-compact thead tr th {
    padding: 0.2rem;
  }
  .mini-table{
    font-size: 0.7rem;
    font-family: sans-serif;
  }
  </style>
