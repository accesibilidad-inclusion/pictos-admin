<template>
  <div class="py-6 px-12">
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 pb-2">Tareas</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="primary">
              <v-icon>mdi-plus</v-icon> Agregar nueva tarea
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="created" :object="newTask" name="tarea" url="/api/tasks/store" method="post"></Form>
        </v-dialog>
      </v-col>
      <v-col cols="2" class="search">
        <v-text-field
            v-model="search_text"
            append-icon="mdi-magnify"
            placeholder="Buscar"
            @click:append="search"
            @keyup.enter="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="status-filter font-weight-medium">
        <a v-bind:class="{ 'active': this.showStatus == '' }" @click="changeStatus('')" class="pr-3 status-filter__item">Todos</a>
        <a v-bind:class="{ 'active': this.showStatus == 'publish' }" @click="changeStatus('publish')" class="px-3 status-filter__item">Publicados</a>
        <a v-bind:class="{ 'active': this.showStatus == 'draft' }" @click="changeStatus('draft')" class="px-3 status-filter__item">Borradores</a>
        <a v-bind:class="{ 'active': this.showStatus == 'contributions' }" @click="changeStatus('contributions')" class="px-3 status-filter__item">Aportes de usuarios</a>
      </v-col>
    </v-row>
    <v-layout v-if="!entries" justify-center class="mt-8">
      <v-progress-circular
        :size="70"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-layout>
    <v-row v-else>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="entries"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td><router-link :to="'/tareas/'+item.id">{{ item.title }}</router-link></td>
                <td>{{ item.venue.name }}</td>
                <td>{{ item.service.name }}</td>
                <td>{{ item.count_steps }}</td>
                <td>{{ item.count_pictograms }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </template>
      </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Task from '../../models/Task'
import Form from '../Utils/Form'

export default {
  name: 'Tasks',
  components: {
    Form
  },
  beforeMount() {
    if(this.$route.params.status)
      this.showStatus = this.$route.params.status
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/tasks/'+this.showStatus).then((response) => {
      this.entries = response.data;
    });
  },
  data() {
    return {
      headers: [
        {
          text: 'Tarea',
          value: 'title',
        },
        {
          text: 'Lugar',
          value: 'venue.name',
        },
        {
          text: 'Servicio',
          value: 'service.name',
        },
        {
          text: 'N° de pasos',
          value: 'count_steps',
        },
        {
          text: 'Pictoograms',
          value: 'count_pictograms',
        },
        {
          text: 'Estado',
          value: 'status',
        },
      ],
      entries: null,
      search_text: '',
      pagination: {},
      dialog: false,
      newTask: new Task(),
      showStatus: ''
    };
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.newTask = new Task();
    },
    created( service ) {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/tasks').then((response) => {
        this.entries = response.data;
      });
      this.closeModal();
    },
    changeStatus(status) {
      this.showStatus = status
      this.entries = null
      let ruta = process.env.VUE_APP_API_DOMAIN + 'api/tasks/'
      if(this.showStatus !== '')
        ruta += this.showStatus + '/';
      if(this.search_text !== '')
        ruta += 'search/' + this.search_text;
      this.$http.get(ruta).then((response) => {
        this.entries = response.data;
      });
    },
    search() {
      this.entries = null;
      let ruta = process.env.VUE_APP_API_DOMAIN + 'api/tasks/';
      if(this.showStatus !== '')
        ruta += this.showStatus + '/';
      ruta += 'search/' + this.search_text;

      this.$http.get(ruta).then((response) => {
        this.entries = response.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
  .search .v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
    transform: none;
  }
  .status-filter {
    padding: 0 1.5rem;
  }
  .status-filter__item {
    position: relative;
    &:after {
      content: '|';
      color: rgba(0, 0, 0, 0.4);
      position: absolute;
      right: -2px;
    }
    &:last-child:after {
      content: none;
    }
    &.active {
      color: rgba(0,0,0,.7);
    }
  }
</style>
