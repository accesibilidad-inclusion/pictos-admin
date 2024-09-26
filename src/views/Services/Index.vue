<template>
  <v-layout v-if="!entries" justify-center align-center fill-height>
    <v-progress-circular :size="48" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div class="w-100 py-6 px-12" v-else>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 pb-2">Servicios</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <v-dialog
          v-if="$store.getters.user.role.name === 'Administrador'"
          persistent
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="primary">
              <v-icon>mdi-plus</v-icon> Agregar nuevo servicio
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="created" :object="newService"></Form>
        </v-dialog>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="filter_country"
          :items="['Todos', 'Chile', 'España', 'Nueva Zelanda']"
          label="Filtrar por país"
          @change="search"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="search_text"
          :append-icon="search_text == '' ? 'mdi-magnify' : 'mdi-window-close'"
          placeholder="Buscar"
          @click:append="clearSearch"
          @keyup.enter="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="entries">
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <router-link :to="'/servicios/' + item.id">{{ item.name }}</router-link>
                </td>
                <td>{{ item.category.name }}</td>
                <td>{{ item.count_presential_venues }}</td>
                <td>{{ item.count_online_venues }}</td>
                <td v-if="item.last_modified">
                  {{ moment(item.last_modified.date).format("DD/MM/YYYY HH:mm") }}
                </td>
                <td v-else>-</td>
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
import Service from "../../models/Service";
import Form from "../Utils/Form";

export default {
  name: "Services",
  components: {
    Form
  },
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + "api/services").then(response => {
      this.entries = response.data;
    });
  },
  data() {
    return {
      headers: [
        {
          text: "Servicio",
          value: "name"
        },
        {
          text: "Categoría",
          value: "category.name"
        },
        {
          text: "Lugares presenciales",
          value: "count_presential_venues"
        },
        {
          text: "Lugares en internet",
          value: "count_online_venues"
        },
        {
          text: "Ultima modificación",
          value: "last_modified.date"
        },
        {
          text: "Estado",
          value: "status"
        }
      ],
      entries: null,
      search_text: "",
      filter_country: "Todos",
      pagination: {},
      dialog: false,
      newService: new Service()
    };
  },
  methods: {
    clearSearch() {
      this.search_text = "";
      this.search();
    },
    search() {
      let filter = '';
      if(this.filter_country !== 'Todos') {
        filter = '?c=' + this.filter_country;
      }
      this.entries = null;
      this.$http
        .get(process.env.VUE_APP_API_DOMAIN + "api/services/search/" + this.search_text + filter)
        .then(response => {
          this.entries = response.data;
        });
    },
    closeModal() {
      this.dialog = false;
      this.newService = new Service();
    },
    created(service, callback) {
      this.$store.dispatch("setServices");
      this.entries.unshift(service);
      this.$toast.success("Servicio creado");
      this.closeModal();
      callback();
    }
  }
};
</script>
