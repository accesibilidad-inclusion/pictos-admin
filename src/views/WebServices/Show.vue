<template>
  <v-layout v-if="!webService.id" justify-center>
    <v-progress-circular :size="70" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div v-else class="py-6 px-12">
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/servicios-web/" class="breadcrumbs__link"
          ><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon>
          Servicios Web</router-link
        >{{ webService.name }}
        <span class="breadcrumbs__status color-published mx-3 px-3">{{ webService.status }}</span>
        <v-btn v-if="webService.service" default text color="primary" :href="clientDomain" target="_blank">Ver en App</v-btn>
        <v-spacer></v-spacer>
        <v-btn text default color="error" @click="deleteWebService()">Eliminar</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5">
        <v-card>
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Información general
            <v-dialog persistent v-model="dialog" width="700">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text small v-bind="attrs" v-on="on" color="primary">
                  Editar
                </v-btn>
              </template>

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editWebService"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li class="py-2"><span class="font-weight-bold">Nombre: </span> {{ webService.name }}</li>
              <li v-if="webService.service" class="py-2">
                <span class="font-weight-bold">Servicio: </span>
                <router-link :to="'/servicios/' + webService.service.id">{{
                  webService.service.name
                }}</router-link>
              </li>
              <li v-if="webService.url != ''" class="py-2">
                <span class="font-weight-bold">Url: </span>
                <a target="_blank" :href="webService.url">{{ webService.url }}</a>
              </li>
              <li v-if="webService.last_modified" class="py-2">
                <span class="font-weight-bold">Ultima modificación: </span>
                Por {{ webService.last_modified.user }} el
                {{ moment(webService.last_modified.date).format("DD/MM/YYYY HH:mm") }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card>
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Este servicio web tiene {{ webService.web_tasks.length }} tareas web
          </v-card-title>
          <v-card-text class="pa-0">
            <ul class="right-box">
              <li
                v-for="(webTask, index) in webService.web_tasks"
                v-bind:key="index"
                class="right-box__item px-9 py-4"
              >
                <router-link :to="'/tareas/' + webTask.id"
                  >{{ index + 1 }} {{ webTask.title }}</router-link
                >
                <span class="color-published mx-3 task-draft" v-if="!webTask.visible">Borrador</span>
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-dialog persistent v-model="dialogWebTask" width="700">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text default v-bind="attrs" v-on="on" color="primary" class="text-right my-3">
              <v-icon>mdi-plus</v-icon> Agregar nueva tarea web
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="updated" :object="newWebTask"></Form>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row v-if="webService.status == 'Publicado'" class="px-3 pt-10">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este servicio web esta publicado
        <v-btn outlined large color="primary" @click="draftWebService()" class="ml-6">Despublicar</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="webService.status == 'Borrador'" class="px-3 pt-10">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este servicio web esta en borrador
        <v-btn outlined large color="primary" @click="publishWebService()" class="ml-6">Publicar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import WebService from "../../models/WebService";
import WebTask from "../../models/WebTask";
import Form from "../Utils/Form";

export default {
  name: "ShowWebService",
  components: {
    Form
  },
  beforeMount() {
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/web_services/" + this.$route.params.id)
      .then(response => {
        this.webService.set(response.data);
        this.newWebTask.set({
          web_service: this.webService,
          form_type: "web_task"
        });
        this.editWebService = _.clone(this.webService);
      });
  },
  computed: {
    clientDomain() {
      return process.env.VUE_APP_CLIENT_DOMAIN + this.webService.category.slug + '/' + this.webService.service.slug + '/' + this.webService.slug;
    } 
  },
  data() {
    return {
      webService: new WebService(),
      newWebTask: new WebTask(),
      editWebService: null,
      dialog: false,
      dialogWebTask: false
    };
  },
  methods: {
    deleteWebService() {
      if (confirm("¿Esta seguro de eliminar este servicio web?")) {
        this.$http
          .post(process.env.VUE_APP_API_DOMAIN + "api/web_services/delete", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$store.dispatch("setWebServices");
            this.$router.push("/servicios-web");
          });
      }
    },
    publishWebService() {
      if (confirm("¿Esta seguro de publicar este servicio web?")) {
        this.$http
          .put(process.env.VUE_APP_API_DOMAIN + "api/web_services/publish", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$store.dispatch("setWebServices");
            if (response.data) this.webService.status = "Publicado";
          });
      }
    },
    draftWebService() {
      if (confirm("¿Esta seguro de despublicar este servicio web?")) {
        this.$http
          .put(process.env.VUE_APP_API_DOMAIN + "api/web_services/draft", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$store.dispatch("setWebServices");
            if (response.data) this.webService.status = "Borrador";
          });
      }
    },
    closeModal() {
      this.dialog = false;
      this.editWebService = _.clone(this.webService);
      this.dialogWebTask = false;
      this.newWebTask.title = "";
      this.newWebTask.tags_text = "";
    },
    updated() {
      this.$http
        .get(process.env.VUE_APP_API_DOMAIN + "api/web_services/" + this.$route.params.id)
        .then(response => {
          this.webService.set(response.data);
          this.editWebService = _.clone(this.webService);
          this.$store.dispatch("setWebServices");
          this.closeModal();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.v-card {
  height: 100%;
}
.breadcrumbs {
  font-size: 1.5rem;
}
.breadcrumbs__link {
  text-decoration: none;
  &:after {
    content: "/";
    padding: 0 0.5rem;
    color: gray;
  }
}
.breadcrumbs__status {
  font-size: 0.9rem;
  padding-top: 2px;
  padding-bottom: 2px;
  &.color-draft {
    background-color: #ffca28;
  }
  &.color-published {
    background-color: #e0e0e0;
  }
}
.right-box {
  list-style: none;
  padding: 0;
}
.right-box__item {
  &:only-child {
    border-bottom: 1px solid #e0e0e0;
  }
  & + .right-box__item {
    border-top: 1px solid #e0e0e0;
  }
}
.task-draft {
  font-style: italic;
}
</style>
