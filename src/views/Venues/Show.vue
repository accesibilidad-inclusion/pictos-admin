<template>
  <v-layout v-if="!venue.id" justify-center>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <div v-else class="py-6 px-12">
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/lugares/" class="breadcrumbs__link"><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Lugares</router-link>{{ venue.name }}
        <span class="breadcrumbs__status color-published mx-3 px-3">{{ venue.status }}</span>
        <v-spacer></v-spacer>
        <v-btn text default  color="error" @click="deleteVenue()">Eliminar</v-btn>
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
            <v-dialog
              v-model="dialog"
              width="700"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn text small v-bind="attrs" v-on="on" color="primary">
                  Editar
                </v-btn>
              </template>

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editVenue" name="lugar" url="/api/venues/update" method="put"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li class="py-2"><span class="font-weight-bold">Nombre:</span> {{ venue.name }}</li>
              <li class="py-2"><span class="font-weight-bold">Servicio:</span> <router-link :to="'/servicios/'+venue.service.id">{{ venue.service.name }}</router-link></li>
              <li v-if="venue.url != ''" class="py-2"><span class="font-weight-bold">Url:</span> <a target="_blank" :href="venue.url">{{ venue.url }}</a></li>
              <li class="py-2"><span class="font-weight-bold">Id:</span> {{ venue.id }}</li>
              <li v-if="venue.tags.length" class="py-2"><span class="font-weight-bold">Sinonimos:</span> {{ venue.tags.join(', ') }}</li>
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
          Este lugar tiene {{ venue.tasks.length }} tareas
          </v-card-title>
          <v-card-text class="pa-0">
            <ul class="right-box">
              <li v-for="(task, index) in venue.tasks" v-bind:key="index" class="right-box__item px-9 py-4">
                <router-link :to="'/tareas/'+task.id">{{ index + 1 }} {{ task.title }}</router-link>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5">
        <v-card>
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Evaluaciones <router-link :to="'/lugares/'+venue.id+'/evaluaciones'">(Ver todas)</router-link>
          </v-card-title>
          <v-card-text class="py-5 px-6">
          Total: {{ venue.evaluations.length }} evaluaciones
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="venue.status == 'Borrador'" class="px-3 pt-10">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este lugar esta en borrador <v-btn outlined large color="primary" @click="publishVenue()" class="ml-6">Publicar</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="venue.status == 'Enviado por usuario'" class="px-3 pt-10">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este lugar es un aporte de un usuario <v-btn outlined large color="primary" @click="publishVenue()" class="ml-6">Publicar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Venue from '../../models/Venue'
import Form from '../Utils/Form'

export default {
  name: 'ShowVenue',
  components: {
    Form
  },
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/venues/'+this.$route.params.id).then((response) => {
      this.venue.set(response.data);
      this.editVenue = _.clone( this.venue  )
    });
  },
  data() {
    return {
      venue: new Venue(),
      editVenue: null,
      dialog: false
    };
  },
  methods: {
    deleteVenue() {
      if(confirm('¿Esta seguro de eliminar este lugar?')) {
        this.$http.post(process.env.VUE_APP_API_DOMAIN + 'api/venues/delete', {
          'id': this.$route.params.id
        }).then((response) => {
          this.$store.dispatch("setVenues");
          this.$router.push('/lugares');
        });
      }
    },
    publishVenue() {
      if(confirm('¿Esta seguro de publicar este lugar?')) {
        this.$http.put(process.env.VUE_APP_API_DOMAIN + 'api/venues/publish', {
          'id': this.$route.params.id
        }).then((response) => {
          this.$store.dispatch("setVenues");
          if(response.data)
            this.venue.status = 'Publicado';
        });
      }
    },
    closeModal() {
      this.dialog = false;
      this.editVenue = _.clone( this.venue );
    },
    updated() {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/venues/'+this.$route.params.id).then((response) => {
        this.venue.set(response.data);
        this.editVenue = _.clone( this.venue  )
        this.$store.dispatch("setVenues");
        this.closeModal();
      });
    }
  },
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
      content: '/';
      padding: 0 0.5rem;
      color: gray;
    }
  }
  .breadcrumbs__status {
    font-size: 0.9rem;
    padding-top: 2px;
    padding-bottom: 2px;
    &.color-draft {
      background-color: #FFCA28;
    }
    &.color-published {
      background-color: #E0E0E0;
    }
  }
  .right-box {
    list-style: none;
    padding: 0;
  }
  .right-box__item {

    &:only-child {
      border-bottom: 1px solid #E0E0E0;
    }
    & + .right-box__item {
      border-top: 1px solid #E0E0E0;
    }
  }
</style>
