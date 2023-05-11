<template>
  <v-layout v-if="!webTask.id" justify-center>
    <v-progress-circular :size="70" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div v-else class="py-6 px-12">
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/tareas-web/" class="breadcrumbs__link"
          ><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon>
          Tarea Web</router-link
        >{{ webTask.title }}
        <span class="breadcrumbs__status color-published mx-3 px-3">{{ webTask.status }}</span>
        <v-btn
          small
          text
          color="primary"
          :href="clientDomain"
          target="_blank"
          >Ver en App</v-btn
        >
        <v-spacer></v-spacer>
        <v-dialog persistent v-model="dialogDuplicate" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text small v-bind="attrs" v-on="on" color="primary">
              Duplicar esta tarea web
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="updated" :object="duplicateWebTask"></Form>
        </v-dialog>
        | <v-btn text small color="error" @click="deleteWebTask()">Eliminar</v-btn>
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
            <v-dialog persistent v-model="dialog" width="770">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text small v-bind="attrs" v-on="on" color="primary">
                  Editar
                </v-btn>
              </template>

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editWebTask"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li class="py-2"><span class="font-weight-bold">Titulo:</span> {{ webTask.title }}</li>
              <li class="py-2" v-if="webTask.service">
                <span class="font-weight-bold">Servicio: </span>
                <router-link :to="'/servicios/' + webTask.service.id">{{
                  webTask.service.name
                }}</router-link>
              </li>
              <li class="py-2">
                <span class="font-weight-bold">Servicio Web: </span>
                <router-link :to="'/servicios-web/' + webTask.web_service.id">{{ webTask.web_service.name }}</router-link>
              </li>
              <!-- <li v-if="webTask.url != ''" class="py-2">
                <span class="font-weight-bold">Url: </span>
                <a target="_blank" :href="webTask.url">{{ webTask.url }}</a>
              </li> -->
              <li class="py-2"><span class="font-weight-bold">Id:</span> {{ webTask.id }}</li>
              <li v-if="webTask.last_modified" class="py-2">
                <span class="font-weight-bold">Ultima modificación:</span>
                Por {{ webTask.last_modified.user }} el
                {{ moment(webTask.last_modified.date).format("DD/MM/YYYY HH:mm") }}
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
            <span v-if="!webTask.web_steps.length">Esta tarea web no tiene pasos</span>
            <span v-else>Esta tarea web tiene {{ webTask.web_steps.length }} pasos</span>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-btn
              v-if="!webTask.web_steps.length"
              color="primary"
              :to="'/tareas-web/' + webTask.id + '/paso/'"
              class="right-box__button"
            >
              <v-icon>mdi-plus</v-icon> Agregar nuevo paso
            </v-btn>
            <ul v-else class="right-box">
              <draggable v-model="webTask.web_steps" @change="setOrder()" handle=".icon-draggable">
                <li
                  v-for="(step, index) in webTask.web_steps"
                  v-bind:key="index"
                  class="right-box__item px-9 py-4 d-flex justify-space-between"
                >
                  <div>
                    <v-icon class="icon-draggable">mdi-drag</v-icon>
                    <router-link :to="'/tareas-web/' + webTask.id + '/paso/' + step.id"
                      >{{ index + 1 }} {{ step.label }}</router-link
                    >
                  </div>
                  <v-btn text small color="error" @click="deleteStep(step.id)">Eliminar</v-btn>
                </li>
              </draggable>
            </ul>
          </v-card-text>
        </v-card>
        <v-btn
          v-if="webTask.web_steps.length"
          color="primary"
          default
          text
          :to="'/tareas-web/' + webTask.id + '/paso/'"
          class="text-right my-3"
        >
          <v-icon>mdi-plus</v-icon> Agregar nuevo paso
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="webTask.status == 'Publicado'" class="px-3 pt-12">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este tarea esta publicada
        <v-btn outlined large color="primary" @click="draftWebTask()" class="ml-6">Despublicar</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="webTask.status == 'Borrador'" class="px-3 pt-12">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este tarea esta en borrador
        <v-btn outlined large color="primary" @click="publishWebTask()" class="ml-6">Publicar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";

import WebTask from "../../models/WebTask";
import Form from "../Utils/Form";

export default {
  name: "ShowWebTask",
  components: {
    Form,
    draggable
  },
  beforeMount() {
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/web_tasks/" + this.$route.params.id)
      .then(response => {
        this.webTask.set(response.data);
        this.editWebTask = _.clone(this.webTask);
        this.duplicateWebTask = _.clone(this.webTask);
        this.duplicateWebTask.form_type = "duplicate";
      });
  },
  data() {
    return {
      webTask: new WebTask(),
      editWebTask: null,
      duplicateWebTask: null,
      dialog: false,
      dialogDuplicate: false
    };
  },
  computed: {
    clientDomain() {
      return (
        process.env.VUE_APP_CLIENT_DOMAIN +
        this.webTask.category.slug +
        "/" +
        this.webTask.service.slug +
        "/" +
        this.webTask.web_service.slug +
        "/" +
        this.webTask.slug
      );
    }
  },
  methods: {
    deleteWebTask() {
      if (confirm("¿Esta seguro de eliminar esta tarea web?")) {
        this.$http
          .post(process.env.VUE_APP_API_DOMAIN + "api/web_tasks/delete", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$router.push("/tareas-web");
          });
      }
    },
    publishWebTask() {
      if (confirm("¿Esta seguro de publicar esta tarea web?")) {
        this.$http
          .put(process.env.VUE_APP_API_DOMAIN + "api/web_tasks/publish", {
            id: this.$route.params.id
          })
          .then(response => {
            if (response.data) this.webTask.status = "Publicado";
          });
      }
    },
    draftWebTask() {
      if (confirm("¿Esta seguro de despublicar esta tarea web?")) {
        this.$http
          .put(process.env.VUE_APP_API_DOMAIN + "api/web_tasks/draft", {
            id: this.$route.params.id
          })
          .then(response => {
            if (response.data) this.webTask.status = "Borrador";
          });
      }
    },
    deleteStep(id) {
      if (confirm("¿Esta seguro de eliminar este paso web?")) {
        this.$http
          .post(process.env.VUE_APP_API_DOMAIN + "api/web_steps/delete", {
            id: id
          })
          .then(response => {
            this.webTask.steps = this.webTask.steps.filter(s => s.id !== id);
          });
      }
    },
    closeModal() {
      this.dialog = false;
      this.dialogDuplicate = false;
      this.editWebTask = _.clone(this.webTask);
      this.duplicateWebTask = _.clone(this.webTask);
      this.duplicateWebTask.form_type = "duplicate";
    },
    updated() {
      this.$http
        .get(process.env.VUE_APP_API_DOMAIN + "api/web_tasks/" + this.$route.params.id)
        .then(response => {
          this.webTask.set(response.data);
          this.editWebTask = _.clone(this.webTask);
          this.closeModal();
        });
    },
    setOrder() {
      this.$http.put(process.env.VUE_APP_API_DOMAIN + "api/web_steps/order", {
        web_steps: this.webTask.web_steps.map((s, i) => {
          return {
            id: s.id,
            order: i + 1
          };
        })
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.v-card {
  min-height: 200px;
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
.right-box__button {
  display: flex;
  max-width: 230px;
  margin: 3rem auto;
}
.icon-draggable {
  cursor: move;
}
</style>
