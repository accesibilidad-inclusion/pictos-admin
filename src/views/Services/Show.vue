<template>
  <v-layout v-if="!service.id" justify-center>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <div v-else class="py-6 px-12">
    <v-row class="mb-3">
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

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editService"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li class="py-2"><span class="font-weight-bold">Nombre:</span> {{ service.name }}</li>
              <li class="py-2"><span class="font-weight-bold">Categoria:</span> {{ service.category.name }}</li>
              <li v-if="service.url != ''" class="py-2"><span class="font-weight-bold">Url:</span> <a target="_blank" :href="service.url">{{ service.url }}</a></li>
              <li class="py-2"><span class="font-weight-bold">Id:</span> {{ service.id }}</li>
              <li v-if="service.tags.length" class="py-2"><span class="font-weight-bold">Sinonimos:</span> {{ service.tags.join(', ') }}</li>
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
          <v-card-text class="pa-0">
            <ul class="right-box">
              <li v-for="(venue, index) in service.venues" v-bind:key="index" class="right-box__item px-9 py-4">
                <router-link :to="'/lugares/'+venue.id">{{ index+1 }} {{ venue.name }}</router-link>
                <span class="color-published mx-3 venue-draft" v-if="!venue.visible">Borrador</span>
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-dialog
          v-model="dialogVenue"
          width="700"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn text default v-bind="attrs" v-on="on" color="primary" class="text-right my-3">
              <v-icon>mdi-plus</v-icon> Agregar nuevo lugar
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="updated" :object="newVenue"></Form>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row v-if="service.status == 'Borrador'" class="px-3 pt-10">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este servicio esta en borrador <v-btn outlined large color="primary" @click="publishService()" class="ml-6">Publicar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Service from '../../models/Service'
import Venue from '../../models/Venue'
import Form from '../Utils/Form'

export default {
  name: 'ShowService',
  components: {
    Form
  },
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/services/'+this.$route.params.id).then((response) => {
      this.service.set(response.data);
      this.newVenue.set({
        service: this.service,
        form_type: 'service'
      })
      this.editService = _.clone( this.service  )
    });
  },
  data() {
    return {
      service: new Service(),
      newVenue: new Venue(),
      editService: null,
      dialog: false,
      dialogVenue: false
    };
  },
  methods: {
    deleteService() {
      if(confirm('¿Esta seguro de eliminar este servicio?')) {
        this.$http.post(process.env.VUE_APP_API_DOMAIN + 'api/services/delete', {
          'id': this.$route.params.id
        }).then((response) => {
          this.$store.dispatch("setServices");
          this.$router.push('/servicios');
        });
      }
    },
    publishService() {
      if(confirm('¿Esta seguro de publicar este servicio?')) {
        this.$http.put(process.env.VUE_APP_API_DOMAIN + 'api/services/publish', {
          'id': this.$route.params.id
        }).then((response) => {
          this.$store.dispatch("setServices");
          if(response.data)
            this.service.status = 'Publicado';
        });
      }
    },
    closeModal() {
      this.dialog = false;
      this.editService = _.clone( this.service );
      this.dialogVenue = false;
    },
    updated() {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/services/'+this.$route.params.id).then((response) => {
        this.service.set(response.data);
        this.$store.dispatch("setServices");
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
  .venue-draft {
    font-style: italic;
  }
</style>
