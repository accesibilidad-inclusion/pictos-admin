<template>
  <v-layout v-if="!service.id" justify-center>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <div v-else>
    <v-row>
      <v-col cols="12">
        <router-link to="/servicios/"><v-icon>mdi-chevron-left</v-icon> Servicios</router-link> | {{ service.name }}
        <span>{{ service.status }}</span>
        <v-btn text small color="error" @click="deleteService()">Eliminar</v-btn>
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
          </v-card-title>
          <v-card-text>
            <ul>
              <li>Nombre: {{ service.name }}</li>
              <li>Categoria: {{ service.category }}</li>
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
            class="headline grey lighten-2"
            primary-title
          >
          Este servicio tiene {{ service.venues.length }} lugares 
          </v-card-title>
          <v-card-text>
            <ul>
              <li v-for="(venue, index) in service.venues">{{ index+1 }} {{ venue.name }}</li>
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
import axios from 'axios';
import Service from '../../models/Service'

export default {
  name: 'Services',
  beforeMount() {
    axios.get('http://pictos-backend.lo/api/services/'+this.$route.params.id).then((response) => {
      this.service.set(response.data);
    });
  },
  data() {
    return {
      service: new Service(),
    };
  },
  methods: {
    deleteService() {
      if(confirm('¿Esta seguro de eliminar este servicio?')) {
        axios.post('http://pictos-backend.lo/api/services/delete', {
          'id': this.$route.params.id
        }).then((response) => {
          this.$router.push('/servicios');
        });
      }
    },
    publishService() {
      if(confirm('¿Esta seguro de publicar este servicio?')) {
        axios.put('http://pictos-backend.lo/api/services/publish', {
          'id': this.$route.params.id
        }).then((response) => {
          if(response.data)
            this.service.status = 'Publicado';
        });
      }
    }
  },
};
</script>