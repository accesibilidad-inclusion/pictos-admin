<template>
  <v-layout v-if="!task.id" justify-center>
    <v-progress-circular :size="70" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div v-else class="py-6 px-12">
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/tareas/" class="breadcrumbs__link"
          ><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon>
          Tareas</router-link
        >{{ task.title }}
        <span class="breadcrumbs__status color-published mx-3 px-3">{{ task.status }}</span>
        <v-btn
          small
          text
          v-if="task.service && task.status != 'Enviado por usuario'"
          color="primary"
          :href="clientDomain"
          target="_blank"
          >Ver en App</v-btn
        >
        <v-spacer></v-spacer>
        <v-dialog persistent v-model="dialogDuplicate" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text small v-bind="attrs" v-on="on" color="primary">
              Duplicar esta tarea
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="updated" :object="duplicateTask"></Form>
        </v-dialog>
        | <v-btn text small color="error" @click="deleteTask()">Eliminar</v-btn>
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

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editTask"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li class="py-2"><span class="font-weight-bold">Titulo:</span> {{ task.title }}</li>
              <li class="py-2" v-if="task.service">
                <span class="font-weight-bold">Servicio: </span>
                <router-link :to="'/servicios/' + task.service.id">{{
                  task.service.name
                }}</router-link>
              </li>
              <li class="py-2">
                <span class="font-weight-bold">Lugar: </span>
                <router-link :to="'/lugares/' + task.venue.id">{{ task.venue.name }}</router-link>
              </li>
              <li v-if="task.url != ''" class="py-2">
                <span class="font-weight-bold">Url:</span>
                <a target="_blank" :href="task.url">{{ task.url }}</a>
              </li>
              <li class="py-2"><span class="font-weight-bold">Id:</span> {{ task.id }}</li>
              <li v-if="task.tags.length" class="py-2">
                <span class="font-weight-bold">Sinonimos:</span> {{ task.tags.join(", ") }}
              </li>
              <li class="py-2"><span class="font-weight-bold">Me gusta:</span> {{ task.likes }}</li>
              <li class="py-2">
                <span class="font-weight-bold">No me gusta:</span> {{ task.dislikes }}
              </li>
              <li class="py-2">
                <span class="font-weight-bold">Tiene prerrequisitos: </span
                ><span v-if="task.hasPrerequisites">Si</span><span v-else>No</span>
              </li>
              <li v-if="task.last_modified" class="py-2">
                <span class="font-weight-bold">Ultima modificación:</span>
                Por {{ task.last_modified.user }} el
                {{ moment(task.last_modified.date).format("DD/MM/YYYY HH:mm") }}
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
            <span v-if="!task.steps.length">Esta tarea no tiene pasos</span>
            <span v-else>Esta tarea tiene {{ task.steps.length }} pasos</span>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-btn
              v-if="!task.steps.length"
              color="primary"
              :to="'/tareas/' + task.id + '/paso/'"
              class="right-box__button"
            >
              <v-icon>mdi-plus</v-icon> Agregar nuevo paso
            </v-btn>
            <ul v-else class="right-box">
              <draggable v-model="task.steps" @change="setOrder()" handle=".icon-draggable">
                <li
                  v-for="(step, index) in task.steps"
                  v-bind:key="index"
                  class="right-box__item px-9 py-4 d-flex justify-space-between"
                >
                  <div>
                    <v-icon class="icon-draggable">mdi-drag</v-icon>
                    <router-link :to="'/tareas/' + task.id + '/paso/' + step.id"
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
          v-if="task.steps.length"
          color="primary"
          default
          text
          :to="'/tareas/' + task.id + '/paso/'"
          class="text-right my-3"
        >
          <v-icon>mdi-plus</v-icon> Agregar nuevo paso
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="task.status == 'Publicado'" class="px-3 pt-12">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este tarea esta publicada
        <v-btn outlined large color="primary" @click="draftTask()" class="ml-6">Despublicar</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="task.status == 'Borrador'" class="px-3 pt-12">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este tarea esta en borrador
        <v-btn outlined large color="primary" @click="publishTask()" class="ml-6">Publicar</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="task.status == 'Enviado por usuario'" class="px-3 pt-12">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Esta tarea es un aporte de un usuario
        <v-btn outlined large color="primary" @click="publishTask()" class="ml-6">Publicar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";

import Task from "../../models/Task";
import Form from "../Utils/Form";

export default {
  name: "ShowTask",
  components: {
    Form,
    draggable
  },
  beforeMount() {
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/tasks/" + this.$route.params.id)
      .then(response => {
        this.task.set(response.data);
        this.editTask = _.clone(this.task);
        this.duplicateTask = _.clone(this.task);
        this.duplicateTask.form_type = "duplicate";
      });
  },
  data() {
    return {
      task: new Task(),
      editTask: null,
      duplicateTask: null,
      dialog: false,
      dialogDuplicate: false
    };
  },
  computed: {
    clientDomain() {
      return (
        process.env.VUE_APP_CLIENT_DOMAIN +
        this.task.category.slug +
        "/" +
        this.task.service.slug +
        "/" +
        this.task.venue.slug +
        "/" +
        this.task.slug
      );
    }
  },
  methods: {
    deleteTask() {
      if (confirm("¿Esta seguro de eliminar este tarea?")) {
        this.$http
          .post(process.env.VUE_APP_API_DOMAIN + "api/tasks/delete", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$router.push("/tareas");
          });
      }
    },
    publishTask() {
      if (confirm("¿Esta seguro de publicar este tarea?")) {
        this.$http
          .put(process.env.VUE_APP_API_DOMAIN + "api/tasks/publish", {
            id: this.$route.params.id
          })
          .then(response => {
            if (response.data) this.task.status = "Publicado";
          });
      }
    },
    draftTask() {
      if (confirm("¿Esta seguro de despublicar este tarea?")) {
        this.$http
          .put(process.env.VUE_APP_API_DOMAIN + "api/tasks/draft", {
            id: this.$route.params.id
          })
          .then(response => {
            if (response.data) this.task.status = "Borrador";
          });
      }
    },
    deleteStep(id) {
      if (confirm("¿Esta seguro de eliminar este paso?")) {
        this.$http
          .post(process.env.VUE_APP_API_DOMAIN + "api/steps/delete", {
            id: id
          })
          .then(response => {
            this.task.steps = this.task.steps.filter(s => s.id !== id);
          });
      }
    },
    closeModal() {
      this.dialog = false;
      this.dialogDuplicate = false;
      this.editTask = _.clone(this.task);
      this.duplicateTask = _.clone(this.task);
      this.duplicateTask.form_type = "duplicate";
    },
    updated() {
      this.$http
        .get(process.env.VUE_APP_API_DOMAIN + "api/tasks/" + this.$route.params.id)
        .then(response => {
          this.task.set(response.data);
          this.editTask = _.clone(this.task);
          this.closeModal();
        });
    },
    setOrder() {
      this.$http.put(process.env.VUE_APP_API_DOMAIN + "api/steps/order", {
        steps: this.task.steps.map((s, i) => {
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
