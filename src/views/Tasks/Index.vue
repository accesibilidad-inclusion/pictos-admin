<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>Tareas</h1>
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

          <Form v-on:cancel="closeModal" v-on:created="created" :object="newTask" name="tarea" url="/api/tasks/store" method="post"></Form>
        </v-dialog>
      </v-col>
      <v-col cols="2">
        <v-autocomplete
          append-icon="mdi-magnify"
          placeholder="Buscar"
          cache-items
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <a v-bind:class="{ 'active': this.showStatus == '' }" @click="changeStatus('')">Todos</a> |
        <a v-bind:class="{ 'active': this.showStatus == 'publish' }" @click="changeStatus('publish')">Publicados</a> |
        <a v-bind:class="{ 'active': this.showStatus == 'draft' }" @click="changeStatus('draft')">Borradores</a> |
        <a v-bind:class="{ 'active': this.showStatus == 'contributions' }" @click="changeStatus('contributions')">Aportes de usuarios</a>
      </v-col>
    </v-row>
    <v-layout v-if="!entries" justify-center>
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
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/tasks/'+status).then((response) => {
        this.entries = response.data;
      });
    }
  },
};
</script>
