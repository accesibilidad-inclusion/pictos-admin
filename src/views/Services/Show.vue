<template>
  <v-layout v-if="!service.id" justify-center>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <div v-else>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/servicios/" class="breadcrumbs__link"><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Servicios</router-link>{{ service.name }}
        <span class="breadcrumbs__status color-published mx-3 px-3">{{ service.status }}</span>
        <v-spacer></v-spacer>
        <v-btn text default color="error" @click="deleteService()">Eliminar</v-btn>
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
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn text small v-bind="attrs" v-on="on" color="primary">
                  Editar
                </v-btn>
              </template>

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editService" name="servicio" url="/api/services/update" method="put"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li>Nombre: {{ service.name }}</li>
              <li>Categoria: {{ service.category.name }}</li>
              <li v-if="service.url != ''">Url: <a target="_blank" :href="service.url">{{ service.url }}</a></li>
              <li>Id: {{ service.id }}</li>
              <li v-if="service.tags.length">Sinonimos: {{ service.tags.join(', ') }}</li>
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
          Este servicio tiene {{ service.venues.length }} lugares
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li v-for="(venue, index) in service.venues" v-bind:key="index">
                <router-link :to="'/lugares/'+venue.id">{{ index+1 }} {{ venue.name }}</router-link>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="service.status == 'Borrador'">
      <v-col cols="12">
        Este servicio esta en borrador <v-btn text small @click="publishService()">Publicar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Service from '../../models/Service'
import Form from '../Utils/Form'

export default {
  name: 'ShowService',
  components: {
    Form
  },
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/services/'+this.$route.params.id).then((response) => {
      this.service.set(response.data);
      this.editService = _.clone( this.service  )
    });
  },
  data() {
    return {
      service: new Service(),
      editService: null,
      dialog: false
    };
  },
  methods: {
    deleteService() {
      if(confirm('¿Esta seguro de eliminar este servicio?')) {
        this.$http.post(process.env.VUE_APP_API_DOMAIN + 'api/services/delete', {
          'id': this.$route.params.id
        }).then((response) => {
          this.$router.push('/servicios');
        });
      }
    },
    publishService() {
      if(confirm('¿Esta seguro de publicar este servicio?')) {
        this.$http.put(process.env.VUE_APP_API_DOMAIN + 'api/services/publish', {
          'id': this.$route.params.id
        }).then((response) => {
          if(response.data)
            this.service.status = 'Publicado';
        });
      }
    },
    closeModal() {
      this.dialog = false;
      this.editService = _.clone( this.service );
    },
    updated() {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/services/'+this.$route.params.id).then((response) => {
        this.service.set(response.data);
        this.editService = _.clone( this.service  )
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
    font-size: 1.6rem;
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
</style>
