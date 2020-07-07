<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>Dashboard</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Lugares <router-link :to="{ name: 'Venues', params: { status: 'contributions' }}">Ver todos</router-link>
          </v-card-title>
          <v-card-text>
            <div v-for="venue in venues" v-bind:key="venue.id">
              <span>{{ moment(venue.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - <router-link :to="'/lugares/'+venue.id">{{ venue.name }}</router-link></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Evaluaciones
          </v-card-title>
          <v-card-text>
            <div v-for="step in steps" v-bind:key="step.id">
              <span>{{ moment(step.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - <router-link :to="'/tareas/'+step.id">{{ step.label }}</router-link></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Tareas <router-link :to="{ name: 'Tasks', params: { status: 'contributions' }}">Ver todos</router-link>
          </v-card-title>
          <v-card-text>
            <div v-for="task in tasks" v-bind:key="task.id">
              <span>{{ moment(task.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - <router-link :to="'/tareas/'+task.id">{{ task.title }}</router-link></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Pictogramas
          </v-card-title>
          <v-card-text>
            <div v-for="step in steps" v-bind:key="step.id">
              <span>{{ moment(step.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - <router-link :to="'/tareas/'+step.id">{{ step.label }}</router-link></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Informe de errores
          </v-card-title>
          <v-card-text>
            <div v-for="report in reports" v-bind:key="report.id">
              <span>{{ moment(report.created_at).format('DD/MM/YYYY \- HH:mm') }}</span>
              <span> - {{ report.report }} en <router-link :to="'/tareas/'+report.task.id">{{ report.task.title }}</router-link></span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
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
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/steps/by_users').then((response) => {
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
      reports: []
    };
  },
  methods: {
  },
};
</script>
