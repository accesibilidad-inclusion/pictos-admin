<template>
  <div class="py-6 px-12">
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 pb-2">Tareas presenciales</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-dialog persistent v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="primary">
              <v-icon>mdi-plus</v-icon> Agregar nueva tarea
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="created" :object="newTask"></Form>
        </v-dialog>
      </v-col>
      <v-col cols="2" class="search">
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
        <v-data-table
          :headers="headers"
          :items="entries"
          :loading="loading"
          :options.sync="options"
          :server-items-length="totalTasks"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <router-link :to="'/tareas-presenciales/' + item.id">{{
                    item.title
                  }}</router-link>
                </td>
                <td>{{ item.venue.name }}</td>
                <td>{{ item.service?.name ?? '-' }}</td>
                <td>{{ item.count_steps }}</td>
                <td>{{ item.count_pictograms }}</td>
                <td>{{ item.likes }}</td>
                <td>{{ item.dislikes }}</td>
                <td v-if="item.modified">
                  {{ moment(item.modified).format("DD/MM/YYYY HH:mm") }}
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
import PresentialTask from "../../models/PresentialTask";
import Form from "../Utils/Form";

export default {
  name: "Tasks",
  components: {
    Form
  },
  data() {
    return {
      totalTasks: 0,
      options: {},
      headers: [
        {
          text: "Tarea",
          value: "title"
        },
        {
          text: "Lugar",
          value: "venues.name"
        },
        {
          text: "Servicio",
          value: "services.name"
        },
        {
          text: "N° de pasos",
          value: "count_steps"
        },
        {
          text: "Pictogramas",
          value: "count_pictograms"
        },
        {
          text: "Votos +",
          value: "likes"
        },
        {
          text: "Votos -",
          value: "dislikes"
        },
        {
          text: "Ultima modificación",
          value: "modified"
        },
        {
          text: "Estado",
          value: "status"
        }
      ],
      entries: [],
      search_text: "",
      pagination: {},
      dialog: false,
      newTask: new PresentialTask(),
      showStatus: this.$route.params.status || "",
      loading: false
    };
  },
  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true
    }
  },
  methods: {
    getDataFromApi() {
      this.loading = true;
      this.$http
        .get(
          process.env.VUE_APP_API_DOMAIN +
            "api/presential_tasks?page=" +
            this.options.page +
            "&itemsPerPage=" +
            this.options.itemsPerPage +
            "&sortBy=" +
            this.options.sortBy[0] +
            "&sortDesc=" +
            this.options.sortDesc[0] +
            "&search=" +
            this.search_text +
            "&status=" +
            this.showStatus
        )
        .then(response => {
          this.entries = response.data.data;
          this.totalTasks = response.data.total;
          this.loading = false;
        });
    },
    closeModal() {
      this.dialog = false;
      this.newTask = new Task();
    },
    created() {
      this.getDataFromApi();
      this.closeModal();
    },
    changeStatus(status) {
      this.showStatus = status;
      this.options.page = 1;
      this.getDataFromApi();
    },
    clearSearch() {
      this.search_text = "";
      this.search();
    },
    search() {
      this.options.page = 1;
      this.getDataFromApi();
    }
  }
};
</script>
<style lang="scss" scoped>
.search .v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
  transform: none;
}
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
