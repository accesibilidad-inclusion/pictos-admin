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
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Evaluaciones presenciales
            <router-link
              :to="{ name: 'PresentialEvaluations' }"
              class="v-btn v-btn--flat v-btn--text theme--light v-size--small primary--text"
              >Ver todos</router-link
            >
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-if="!presential_evaluations.length">
              No hay evaluaciones enviadas por usuarios
            </div>
            <template v-else>
              <div
                v-for="evaluation in presential_evaluations"
                v-bind:key="evaluation.id"
                class="py-1"
              >
                <span class="grey--text lighten-2">{{
                  moment(evaluation.created_at).format("DD/MM/YYYY \- HH:mm")
                }}</span>
                <span>
                  -
                  <a @click="$router.push('/lugares-presenciales/evaluacion/' + evaluation.id)">{{
                    evaluation.presential_venue.name
                  }}</a></span
                >
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Evaluaciones en internet
            <router-link
              :to="{ name: 'OnlineEvaluations' }"
              class="v-btn v-btn--flat v-btn--text theme--light v-size--small primary--text"
              >Ver todos</router-link
            >
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-if="!online_evaluations.length">
              No hay evaluaciones enviadas por usuarios
            </div>
            <template v-else>
              <div v-for="evaluation in online_evaluations" v-bind:key="evaluation.id" class="py-1">
                <span class="grey--text lighten-2">{{
                  moment(evaluation.created_at).format("DD/MM/YYYY \- HH:mm")
                }}</span>
                <span>
                  -
                  <a @click="$router.push('/lugares-en-internet/evaluacion/' + evaluation.id)">{{
                    evaluation.online_venue.name
                  }}</a></span
                >
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Lugares
            <router-link
              :to="{ name: 'Venues', params: { status: 'contributions' } }"
              class="v-btn v-btn--flat v-btn--text theme--light v-size--small primary--text"
              >Ver todos</router-link
            >
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-if="!venues.length">
              No hay lugares propuestos por usuarios
            </div>
            <template v-else>
              <div v-for="venue in venues" v-bind:key="venue.id" class="py-1">
                <span class="grey--text lighten-2">{{
                  moment(venue.created_at).format("DD/MM/YYYY \- HH:mm")
                }}</span>
                <span>
                  - <a @click="setObjectEdit('venues', venue)">{{ venue.name }}</a></span
                >
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Tareas
            <router-link
              :to="{ name: 'PresentialTasks', params: { status: 'contributions' } }"
              class="v-btn v-btn--flat v-btn--text theme--light v-size--small primary--text"
              >Ver todos</router-link
            >
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-if="!tasks.length">
              No hay tareas propuestas por usuarios
            </div>
            <template v-else>
              <div v-for="task in tasks" v-bind:key="task.id" class="py-1">
                <span class="grey--text lighten-2">{{
                  moment(task.created_at).format("DD/MM/YYYY \- HH:mm")
                }}</span>
                <span>
                  - <a @click="setObjectEdit('tasks', task)">{{ task.title }}</a></span
                >
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Pictogramas
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-if="!proposal_tasks.length">
              No hay pictogramas propuestos por usuarios
            </div>
            <template v-else>
              <div v-for="proposal in proposal_tasks" v-bind:key="proposal.id" class="py-1">
                <span class="grey--text lighten-2">{{
                  moment(proposal.created_at).format("DD/MM/YYYY \- HH:mm")
                }}</span>
                <span>
                  -
                  <a @click="setObjectEdit('proposal_tasks', proposal)">{{
                    proposal.presential_task.title
                  }}</a></span
                >
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="100%">
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Informe de errores
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <div v-if="!reports.length">
              No hay errores reportados
            </div>
            <template v-else>
              <div v-for="report in reports" v-bind:key="report.id" class="py-1">
                <span class="grey--text lighten-2">{{
                  moment(report.created_at).format("DD/MM/YYYY \- HH:mm")
                }}</span>
                <span>
                  - {{ report.report }} en
                  <a
                    v-if="report.presential_task"
                    @click="$router.push('/tareas-presenciales/' + report.presential_task.id)"
                    >{{ report.presential_task.title }}</a
                  >
                  <a
                    v-if="report.online_task"
                    @click="$router.push('/tareas-en-internet/' + report.online_task.id)"
                    >{{ report.online_task.title }}</a
                  >
                </span>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog persistent v-model="dialog" width="700">
      <Form v-on:cancel="closeModal" v-on:updated="update" :object="objectEdit"></Form>
    </v-dialog>
  </div>
</template>

<script>
import PresentialVenue from "../../models/PresentialVenue";
import PresentialTask from "../../models/PresentialTask";
import ProposalTask from "../../models/ProposalTask";
import Form from "../Utils/Form";

export default {
  name: "Dashboard",
  components: {
    Form
  },
  beforeMount() {
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/presential_venues/by_users")
      .then(response => {
        this.venues = response.data;
      });
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/presential_tasks/by_users")
      .then(response => {
        this.tasks = response.data;
      });
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/proposal_tasks/by_users")
      .then(response => {
        this.proposal_tasks = response.data;
      });
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/evaluations/get_presential_limit")
      .then(response => {
        this.presential_evaluations = response.data;
      });
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/evaluations/get_online_limit")
      .then(response => {
        this.online_evaluations = response.data;
      });
    this.$http.get(process.env.VUE_APP_API_DOMAIN + "api/reports").then(response => {
      this.reports = response.data;
    });
  },
  data() {
    return {
      venues: [],
      tasks: [],
      proposal_tasks: [],
      presential_evaluations: [],
      online_evaluations: [],
      reports: [],
      dialog: false,
      objectEdit: null,
      typeEdit: null
    };
  },
  methods: {
    closeModal() {
      this.dialog = false;
    },
    setObjectEdit(type, obj) {
      this.typeEdit = type;
      if (type == "venues") this.objectEdit = new PresentialVenue();
      else if (type == "tasks") this.objectEdit = new PresentialTask();
      else if (type == "proposal_tasks") this.objectEdit = new ProposalTask();
      this.objectEdit.set(obj);
      this.objectEdit.visible = 0;
      this.dialog = true;
    },
    update() {
      this.$http
        .get(process.env.VUE_APP_API_DOMAIN + "api/" + this.typeEdit + "/by_users")
        .then(response => {
          this[this.typeEdit] = response.data;
        });
      this.dialog = false;
    }
  }
};
</script>
