<template>
      <div class="col-sm-2 mb-2">
        <CFormInput size="sm" type="text" id="searchData" v-model="search" placeholder="Search"/>
      </div>
    <div>
        <vue3-datatable 
        :rows="rows" 
        :columns="cols" 
        :loading="loading" 
        :sortable="true" 
        skin="bh-table-hover bh-table-bordered bh-table-compact" 
        :search="search"
        style="font-size: smaller;"
        >
            <template #id="data">
                <strong>{{ data.id_machine }}</strong>
            </template>
            <template #actions="data">
                <div class="flex gap-4">
                    <CButton size="sm" class="btn-primary" style="margin: 0.1rem;" @click="editItem(data.value)" v-if="userRole !== 'viewer'"><CIcon icon="cil-pencil" /></CButton>
                    <CButton size="sm" class="btn-danger" style="margin: 0.1rem;" @click="deleteItem(data.value)" v-if="userRole === 'admin'"><CIcon icon="cil-trash" /></CButton>
                </div>
            </template>
        </vue3-datatable>
    </div>
</template>
<script setup>
    import axios from 'axios';
    import { ref, onMounted, getCurrentInstance, watch } from 'vue';
    import Vue3Datatable from '@bhplugin/vue3-datatable';
    import '@bhplugin/vue3-datatable/dist/style.css';
    import formatDate from '@/middleware/LocaleDate';


      const instance = getCurrentInstance();
      const search = ref('')
      const props = defineProps(['userRole', 'eventTable']);

      onMounted(() => {
        fetchData();
      });

      watch(() => props.eventTable.refreshKanagata, (newValue) => {
        if (newValue) {
          fetchData();
          // eslint-disable-next-line vue/no-mutating-props
          props.eventTable.refreshKanagata = false;
          instance.emit('close')
          instance.emit('notif')
        }
      });

      const loading = ref(true);
      const data = ref([])
      const pageSize = ref()
      const rows = ref(null);

      const cols =
          ref([
              { field: 'id_kanagata', title: 'ID Kanagata', isUnique: true },
              { field: 'cavity', title: 'Cavity' },
              { field: 'actual_shot', title: 'Actual Shot' },
              { field: 'limit_shot', title: 'Limit Shot' },
              { field: 'created_at', title: 'Created At' },
              { field: 'updated_at', title: 'Updated At' },
              { field: 'actions', title: 'Actions', sort:false },
          ]) || [];
      
      const fetchData = () => {
        axios.get('http://192.168.148.125:5000/kanagata')
          .then(response => {
            const formattedData = response.data.data.map(item => ({
              ...item,
              created_at: formatDate(item.created_at),
              updated_at: formatDate(item.updated_at)
            }));
            data.value = formattedData;
            rows.value = formattedData; // Assign formatted data to rows
            loading.value = false; // Update loading status after data is fetched
            pageSize.value = formattedData.length
          })
          .catch(error => {
            console.log('Error fetching data:', error);
            loading.value = false; // Update loading status in case of error
          });
      };


      const editItem = (item) => {
      instance.emit('edit-item', item);
    };

    const deleteItem = (item) => {
      const deleteItem = { ...item, mode: 'delete' };
      instance.emit('delete-item', deleteItem);
    };
</script>