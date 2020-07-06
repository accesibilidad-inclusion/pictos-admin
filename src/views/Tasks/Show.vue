<template>
  <v-layout v-if="!task.id" justify-center>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <div v-else>
    <v-row>
      <v-col cols="12">
        <router-link to="/tareas/"><v-icon>mdi-chevron-left</v-icon> Tareas</router-link> | {{ task.name }}
        <span>{{ task.status }}</span>
        <v-btn text small color="error" @click="deleteTask()">Eliminar</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5">
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Información general 
            <v-dialog
              v-model="dialog"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn text small v-bind="attrs" v-on="on" color="primary">
                  Editar
                </v-btn>
              </template>

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editTask" name="tarea" url="/api/tasks/update" method="put"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text>
            <ul>
              <li>Titulo: {{ task.title }}</li>
              <li>Servicio: <router-link :to="'/servicios/'+task.service.id">{{ task.service.name }}</router-link></li>
              <li>Lugar: <router-link :to="'/lugares/'+task.venue.id">{{ task.venue.name }}</router-link></li>
              <li v-if="task.url != ''">Url: <a target="_blank" :href="task.url">{{ task.url }}</a></li>
              <li>Id: {{ task.id }}</li>
              <li v-if="task.tags.length">Sinonimos: {{ task.tags.join(', ') }}</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            <span v-if="!task.steps.length">Esta tarea no tiene pasos</span>
            <span v-else>Esta tarea tiene {{ task.steps.length }} pasos</span>
          </v-card-title>
          <v-card-text>
            <v-btn v-if="!task.steps.length" color="primary" :to="{ name: 'AddStep', params: { task_id: task.id }}">
              <v-icon>mdi-plus</v-icon> Agregar nuevo paso
            </v-btn>
            <ul v-else>
              <li v-for="(step, index) in task.steps" v-bind:key="index">{{ index+1 }} {{ step.label }}</li>
            </ul>
          </v-card-text>
        </v-card>
        <v-btn v-if="task.steps.length" color="primary" small text :to="{ name: 'AddStep', params: { task_id: task.id }}">
          <v-icon>mdi-plus</v-icon> Agregar nuevo paso
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="task.status == 'Borrador'">
      <v-col cols="12">
        Este tarea esta en borrador <v-btn text small @click="publishTask()">Publicar</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="task.status == 'Aporte del usuario'">
      <v-col cols="12">
        Esta tarea es un aporte de un usuario <v-btn text small @click="publishTask()">Publicar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Task from '../../models/Task'
import Form from '../Utils/Form'

export default {
  name: 'ShowTask',
  components: {
    Form
  },
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/tasks/'+this.$route.params.id).then((response) => {
      this.task.set(response.data);
      this.editTask = _.clone( this.task  )
    });
  },
  data() {
    return {
      task: new Task(),
      editTask: null,
      dialog: false
    };
  },
  methods: {
    deleteTask() {
      if(confirm('¿Esta seguro de eliminar este tarea?')) {
        this.$http.post(process.env.VUE_APP_API_DOMAIN + 'api/tasks/delete', {
          'id': this.$route.params.id
        }).then((response) => {
          this.$router.push('/tareas');
        });
      }
    },
    publishTask() {
      if(confirm('¿Esta seguro de publicar este tarea?')) {
        this.$http.put(process.env.VUE_APP_API_DOMAIN + 'api/tasks/publish', {
          'id': this.$route.params.id
        }).then((response) => {
          if(response.data)
            this.task.status = 'Publicado';
        });
      }
    },
    closeModal() {
      this.dialog = false;
      this.editTask = _.clone( this.task );
    },
    updated() {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/tasks/'+this.$route.params.id).then((response) => {
        this.task.set(response.data);
        this.editTask = _.clone( this.task  )
        this.closeModal();
      });
    }
  },
};
</script>