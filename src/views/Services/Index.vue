<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>Servicios</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="primary">
              <v-icon>mdi-plus</v-icon> Agregar nuevo servicio
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:created="created" :object="newService" name="servicio" url="/api/services/store"></Form>
        </v-dialog>
      </v-col>
      <v-col cols="2">
        <v-autocomplete
          append-icon="mdi-magnify"
          placeholder="Buscar"
          cache-items
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-layout v-if="!entries" justify-center>
      <v-progress-circular
        :size="70"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-layout>
    <v-row v-else>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="entries"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.id }}</td>
                <td><router-link :to="'/servicios/'+item.id">{{ item.name }}</router-link></td>
                <td>{{ item.category }}</td>
                <td>{{ item.count_venues }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </template>
      </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';
import Service from '../../models/Service'
import Form from '../Utils/Form'

export default {
  name: 'Services',
  components: {
    Form
  },
  beforeMount() {
    axios.get('http://pictos-backend.lo/api/services').then((response) => {
      this.entries = response.data;
    });
  },
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
          align: 'start',
        },
        {
          text: 'Servicio',
          value: 'name',
        },
        {
          text: 'Categoría',
          value: 'category',
        },
        {
          text: 'Cantidad de lugares',
          value: 'count_venues',
        },
        {
          text: 'Estado',
          value: 'status',
        },
      ],
      entries: null,
      pagination: {},
      dialog: false,
      newService: new Service(),
    };
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.newService = new Service();
    },
    created( service ) {
      axios.get('http://pictos-backend.lo/api/services').then((response) => {
        this.entries = response.data;
      });
      this.closeModal();
    }
  },
};
</script>
