<template>
  <div class="py-6 px-12">
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 pb-3">Dashboard</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between" primary-title>
            Lugares <router-link :to="{ name: 'Venues', params: { status: 'contributions' }}"
            class="v-btn v-btn--flat v-btn--text theme--light v-size--small primary--text">Ver todos</router-link>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-for="venue in venues" v-bind:key="venue.id" class="py-1">
              <span class="grey--text lighten-2">{{ moment(venue.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - <a @click="setVenueEdit(venue)">{{ venue.name }}</a></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between" primary-title>
            Evaluaciones
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-for="step in steps" v-bind:key="step.id" class="py-1">
              <span class="grey--text lighten-2">{{ moment(step.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - <router-link :to="'/tareas/'+step.id">{{ step.label }}</router-link></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between" primary-title>
            Tareas <router-link :to="{ name: 'Tasks', params: { status: 'contributions' }}"
            class="v-btn v-btn--flat v-btn--text theme--light v-size--small primary--text">Ver todos</router-link>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-for="task in tasks" v-bind:key="task.id" class="py-1">
              <span class="grey--text lighten-2">{{ moment(task.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - <a @click="setTaskEdit(task)">{{ task.title }}</a></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between" primary-title>
            Pictogramas
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-for="step in steps" v-bind:key="step.id" class="py-1">
              <span class="grey--text lighten-2">{{ moment(step.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - <router-link :to="'/tareas/'+step.id">{{ step.label }}</router-link></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card height="100%">
          <v-card-title class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between" primary-title>
            Informe de errores
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-for="report in reports" v-bind:key="report.id" class="py-1">
              <span class="grey--text lighten-2">{{ moment(report.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - {{ report.report }} en <router-link :to="'/tareas/'+report.task.id">{{ report.task.title }}</router-link></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="venueDialog"
      width="500"
    >
      <Form
        v-on:cancel="closeModalVenue"
        v-on:updated="updateVenues"
        :object="venueEdit"
      ></Form>
    </v-dialog>
    <v-dialog
      v-model="taskDialog"
      width="500"
    >
      <Form
        v-on:cancel="closeModalTask"
        v-on:updated="updateTasks"
        :object="taskEdit"
      ></Form>
    </v-dialog>
  </div>
</template>

<script>
import Venue from '../../models/Venue'
import Task from '../../models/Task'
import Form from '../Utils/Form'

export default {
  name: 'Dashboard',
  components: {
    Form
  },
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/venues/by_users').then((response) => {
      this.venues = response.data;
    });
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/tasks/by_users').then((response) => {
      this.tasks = response.data;
    });
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/tasks/by_users_with_pictograms').then((response) => {
      this.steps = response.data;
    });
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/reports').then((response) => {
      this.reports = response.data;
    });
  },
  data() {
    return {
      venues: [],
      tasks: [],
      steps: [],
      reports: [],
      venueDialog: false,
      venueEdit: new Venue(),
      taskDialog: false,
      taskEdit: new Task()
    };
  },
  methods: {
    closeModalVenue() {
      this.venueDialog = false
    },
    setVenueEdit(venue) {
      this.venueEdit.set(venue)
      this.venueEdit.visible = 0
      this.venueDialog = true
    },
    updateVenues() {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/venues/by_users').then((response) => {
        this.venues = response.data;
      });
      this.venueDialog = false
    },
    closeModalTask() {
      this.taskDialog = false
    },
    setTaskEdit(task) {
      this.taskEdit.set(task)
      this.taskEdit.visible = 0
      this.taskDialog = true
    },
    updateTasks() {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/tasks/by_users').then((response) => {
        this.tasks = response.data;
      });
      this.taskDialog = false
    }
  },
};
</script>
