<template>
  <div class="py-6 px-12">
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 pb-2">Usuarios</h1>
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
              <v-icon>mdi-plus</v-icon> Agregar nuevo usuario
            </v-btn>
          </template>

          <Form
            v-on:cancel="closeModal"
            v-on:updated="created"
            :object="newUser"
          ></Form>
        </v-dialog>
      </v-col>
      <v-col cols="2">
        <v-text-field
            v-model="search_text"
            append-icon="mdi-magnify"
            placeholder="Buscar"
            @click:append="search"
            @keyup.enter="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-layout v-if="!entries" justify-center class="mt-8">
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
                <td><router-link :to="'/usuarios/'+item.id">{{ item.name }}</router-link></td>
                <td>{{ item.email }}</td>
              </tr>
            </tbody>
          </template>
      </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import User from '../../models/User'
import Form from '../Utils/Form'

export default {
  name: 'Users',
  components: {
    Form
  },
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/users').then((response) => {
      this.entries = response.data;
    });
  },
  data() {
    return {
      headers: [
        {
          text: 'Id',
          value: 'id',
        },
        {
          text: 'Nombre',
          value: 'name',
        },
        {
          text: 'E-amil',
          value: 'email',
        },
      ],
      entries: null,
      search_text: '',
      pagination: {},
      dialog: false,
      newUser: new User(),
    };
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.newUser = new User();
    },
    created( user ) {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/users').then((response) => {
        this.entries = response.data;
      });
      this.closeModal();
    },
    search() {
      this.entries = null;
      let ruta = process.env.VUE_APP_API_DOMAIN + 'api/users/search/' + this.search_text;

      this.$http.get(ruta).then((response) => {
        this.entries = response.data;
      });
    },
  },
};
</script>
