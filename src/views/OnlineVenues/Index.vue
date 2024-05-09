<template>
  <v-layout v-if="!entries" justify-center align-center fill-height>
    <v-progress-circular :size="48" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div class="w-100 py-6 px-12" v-else>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 pb-2">Lugares en internet</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-dialog persistent v-model="dialog" width="700">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="primary">
              <v-icon>mdi-plus</v-icon> Agregar nuevo lugar
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="created" :object="newVenue"></Form>
        </v-dialog>
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
      <v-col cols="12" class="status-filter font-weight-medium">
        <a
          v-bind:class="{ active: this.showStatus == '' }"
          @click="changeStatus('')"
          class="pr-3 status-filter__item"
          >Todos</a
        >
        <a
          v-bind:class="{ active: this.showStatus == 'publish' }"
          @click="changeStatus('publish')"
          class="px-3 status-filter__item"
          >Publicados</a
        >
        <a
          v-bind:class="{ active: this.showStatus == 'draft' }"
          @click="changeStatus('draft')"
          class="px-3 status-filter__item"
          >Borradores</a
        >
        <a
          v-bind:class="{ active: this.showStatus == 'contributions' }"
          @click="changeStatus('contributions')"
          class="px-3 status-filter__item"
          >Aportes de usuarios</a
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="entries">
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <router-link :to="'/lugares-en-internet/' + item.id">{{ item.name }}</router-link>
                </td>
                <td>
                  <span v-if="item.service">{{ item.service.name }}</span
                  ><span v-else>-</span>
                </td>
                <td>{{ item.url }}</td>
                <td>{{ item.count_tasks }}</td>
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
import OnlineVenue from "../../models/OnlineVenue";
import Form from "../Utils/Form";

export default {
  name: "OnlineVenues",
  components: {
    Form
  },
  beforeMount() {
    if (this.$route.params.status) this.showStatus = this.$route.params.status;
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/online_venues/" + this.showStatus)
      .then(response => {
        this.entries = response.data;
      });
  },
  data() {
    return {
      headers: [
        {
          text: "Lugar",
          value: "name"
        },
        {
          text: "Servicio",
          value: "service.name"
        },
        {
          text: "Url",
          value: "url"
        },
        {
          text: "N° de tareas",
          value: "count_tasks"
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
      pagination: {},
      dialog: false,
      newVenue: new OnlineVenue(),
      showStatus: ""
    };
  },
  methods: {
    closeModal() {
      this.dialog = false;
      this.newVenue = new OnlineVenue();
    },
    created(onlineVenue, callback) {
      this.$store.dispatch("setOnlineVenues");
      this.$toast.success("Lugar en internet creado");
      this.changeStatus('');
      this.closeModal();
      callback();
    },
    changeStatus(status) {
      this.entries = null;
      this.showStatus = status;
      let ruta = process.env.VUE_APP_API_DOMAIN + "api/online_venues/";
      if (this.showStatus !== "") ruta += this.showStatus + "/";
      if (this.search_text !== "") ruta += "search/" + this.search_text;
      this.$http.get(ruta).then(response => {
        this.entries = response.data;
      });
    },
    clearSearch() {
      this.search_text = "";
      this.search();
    },
    search() {
      this.entries = null;
      let ruta = process.env.VUE_APP_API_DOMAIN + "api/online_venues/";
      if (this.showStatus !== "") ruta += this.showStatus + "/";
      ruta += "search/" + this.search_text;

      this.$http.get(ruta).then(response => {
        this.entries = response.data;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.status-filter {
  padding: 0 1.5rem;
}
.status-filter__item {
  position: relative;
  &:after {
    content: "|";
    color: rgba(0, 0, 0, 0.4);
    position: absolute;
    right: -2px;
  }
  &:last-child:after {
    content: none;
  }
  &.active {
    color: rgba(0, 0, 0, 0.7);
  }
}
</style>
