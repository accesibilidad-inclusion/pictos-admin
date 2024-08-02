<template>
  <v-layout v-if="!service.id" justify-center align-center fill-height>
    <v-progress-circular :size="48" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div v-else class="w-100 py-6 px-12">
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/servicios/" class="breadcrumbs__link"
          ><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon>
          Servicios</router-link
        >{{ service.name }}
        <span class="breadcrumbs__status color-published mx-3 px-3">{{ service.status }}</span>
        <v-btn default text color="primary" :href="clientDomain" target="_blank">Ver en App</v-btn>
        <v-spacer></v-spacer>
        <v-btn text default color="error" @click="deleteService()">Eliminar</v-btn>
      </v-col>
    </v-row>
    <v-row class="mb-10">
      <v-col cols="5">
        <v-card>
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Información general
            <v-dialog persistent v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn text small v-bind="attrs" v-on="on" color="primary">
                  Editar
                </v-btn>
              </template>

              <Form v-on:cancel="closeModal" v-on:updated="serviceUpdated" :object="editService"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li class="py-2"><span class="font-weight-bold">Id:</span> {{ service.id }}</li>
              <li class="py-2"><span class="font-weight-bold">Nombre:</span> {{ service.name }}</li>
              <li class="py-2">
                <span class="font-weight-bold">Categoria:</span> {{ service.category.name }}
              </li>
              <li class="py-2">
                <span class="font-weight-bold">País:</span> {{ service.country.name }}
              </li>
              <li v-if="service.url != ''" class="py-2">
                <span class="font-weight-bold">Url: </span>
                <a target="_blank" :href="service.url">{{ service.url }}</a>
              </li>
              <li v-if="service.tags.length" class="py-2">
                <span class="font-weight-bold">Sinonimos:</span> {{ service.tags.join(", ") }}
              </li>
              <li v-if="service.last_modified" class="py-2">
                <span class="font-weight-bold">Ultima modificación:</span>
                Por {{ service.last_modified.user }} el
                {{ moment(service.last_modified.date).format("DD/MM/YYYY HH:mm") }}
              </li>
              <li class="py-2">
                <span class="font-weight-bold">N° de tareas presenciales publicadas:</span>
                {{ presentialTasksPublished }}
                <span v-if="presentialTasksPublished">({{ presentialStepsPublished }} pasos)</span>
              </li>
              <li class="py-2">
                <span class="font-weight-bold">N° de tareas en internet publicadas:</span>
                {{ onlineTasksPublished }}
                <span v-if="onlineTasksPublished">({{ onlineStepsPublished }} pasos)</span>
              </li>
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
            Este servicio tiene {{ service.presential_venues.length }} lugares presenciales
          </v-card-title>
          <v-card-text class="pa-0">
            <ul class="right-box">
              <li
                v-for="(venue, index) in service.presential_venues"
                v-bind:key="index"
                class="right-box__item px-9 py-4 d-flex justify-space-between"
              >
                <div>
                  <router-link :to="'/lugares-presenciales/' + venue.id"
                    >{{ index + 1 }} {{ venue.name }}</router-link
                  >
                  <span class="color-published mx-3 venue-draft" v-if="!venue.visible"
                    >Borrador</span
                  >
                </div>
                <div class="color-published venue-draft">
                  Tareas publicadas: {{ venue.tasks_published_count }} / Tareas en borrador:
                  {{ venue.tasks_drafted_count }}
                </div>
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-dialog persistent v-model="dialogPresentialVenue" width="700">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text default v-bind="attrs" v-on="on" color="primary" class="text-right my-3">
              <v-icon>mdi-plus</v-icon> Agregar nuevo lugar presencial
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="presentialVenueUpdated" :object="newPresentialVenue"></Form>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7" offset="5">
        <v-card>
          <v-card-title
            class="font-weight-regular grey lighten-4 ps-6 d-flex flex-no-wrap justify-space-between"
            primary-title
          >
            Este servicio tiene {{ service.online_venues.length }} lugares en internet
          </v-card-title>
          <v-card-text class="pa-0">
            <ul class="right-box">
              <li
                v-for="(venue, index) in service.online_venues"
                v-bind:key="index"
                class="right-box__item px-9 py-4 d-flex justify-space-between"
              >
                <div>
                  <router-link :to="'/lugares-en-internet/' + venue.id"
                    >{{ index + 1 }} {{ venue.name }}</router-link
                  >
                  <span class="color-published mx-3 venue-draft" v-if="!venue.visible"
                    >Borrador</span
                  >
                </div>
                <div class="color-published venue-draft">
                  Tareas publicadas: {{ venue.tasks_published_count }} / Tareas en borrador:
                  {{ venue.tasks_drafted_count }}
                </div>
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-dialog persistent v-model="dialogOnlineVenue" width="700">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text default v-bind="attrs" v-on="on" color="primary" class="text-right my-3">
              <v-icon>mdi-plus</v-icon> Agregar nuevo lugar en internet
            </v-btn>
          </template>

          <Form v-on:cancel="closeModal" v-on:updated="onlineVenueUpdated" :object="newOnlineVenue"></Form>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row v-if="service.status == 'Borrador'" class="px-3 pt-10">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este servicio esta en borrador
        <v-btn outlined large color="primary" @click="publishService()" class="ml-6"
          >Publicar</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="service.status == 'Publicado'" class="px-3 pt-10">
      <v-col cols="12" class="grey lighten-4 py-8 pr-10 d-flex justify-end align-center">
        Este servicio esta publicado
        <v-btn outlined large color="primary" @click="draftService()" class="ml-6"
          >Despublicar</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Service from "../../models/Service";
import PresentialVenue from "../../models/PresentialVenue";
import OnlineVenue from "../../models/OnlineVenue";
import Form from "../Utils/Form";

export default {
  name: "ShowService",
  components: {
    Form
  },
  beforeMount() {
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/services/" + this.$route.params.id)
      .then(response => {
        this.service.set(response.data);
        this.newPresentialVenue.set({
          service: this.service,
          form_type: "service"
        });
        this.newOnlineVenue.set({
          service: this.service,
          form_type: "service"
        });
        this.editService = _.clone(this.service);
      });
  },
  computed: {
    clientDomain() {
      return (
        process.env.VUE_APP_CLIENT_DOMAIN + this.service.category.slug + "/" + this.service.slug
      );
    },
    presentialTasksPublished() {
      return this.service.presential_venues.reduce(
        (a, b) => (b.visible ? a + b.tasks_published_count : a),
        0
      );
    },
    presentialStepsPublished() {
      return this.service.presential_venues.reduce(
        (a, b) => (b.visible ? a + b.steps_published : a),
        0
      );
    },
    onlineTasksPublished() {
      return this.service.online_venues.reduce(
        (a, b) => (b.visible ? a + b.tasks_published_count : a),
        0
      );
    },
    onlineStepsPublished() {
      return this.service.online_venues.reduce(
        (a, b) => (b.visible ? a + b.steps_published : a),
        0
      );
    }
  },
  data() {
    return {
      service: new Service(),
      newPresentialVenue: new PresentialVenue(),
      newOnlineVenue: new OnlineVenue(),
      editService: null,
      dialog: false,
      dialogPresentialVenue: false,
      dialogOnlineVenue: false
    };
  },
  methods: {
    deleteService() {
      if (confirm("¿Esta seguro de eliminar este servicio?")) {
        this.$http
          .post(process.env.VUE_APP_API_DOMAIN + "api/services/delete", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$store.dispatch("setServices");
            this.$toast.success("Servicio eliminado");
            this.$router.push("/servicios");
          });
      }
    },
    publishService() {
      if (confirm("¿Esta seguro de publicar este servicio?")) {
        this.$http
          .put(process.env.VUE_APP_API_DOMAIN + "api/services/publish", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$store.dispatch("setServices");
            this.$toast.success("Servicio publicado");
            if (response.data) this.service.status = "Publicado";
          });
      }
    },
    draftService() {
      if (confirm("¿Esta seguro de despublicar este servicio?")) {
        this.$http
          .put(process.env.VUE_APP_API_DOMAIN + "api/services/draft", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$store.dispatch("setServices");
            this.$toast.success("Servicio dejado en borrador");
            if (response.data) this.service.status = "Borrador";
          });
      }
    },
    closeModal() {
      this.dialog = false;
      this.editService = _.clone(this.service);
      this.dialogOnlineVenue = false;
      this.dialogPresentialVenue = false;
    },
    serviceUpdated(service, callback) {
      this.service.set(service);
      this.$store.dispatch("setServices");
      this.closeModal();
      this.$toast.success("Servicio actualizado");
      callback();
    },
    presentialVenueUpdated(presentialVenue, callback) {
      this.service.presential_venues.push(presentialVenue);
      this.$store.dispatch("setPresentialVenues");
      this.closeModal();
      this.$toast.success("Lugar presencial creado");
      callback();
    },
    onlineVenueUpdated(onlineVenue, callback) {
      this.service.online_venues.push(onlineVenue);
      this.$store.dispatch("setOnlineVenues");
      this.closeModal();
      this.$toast.success("Lugar en internet creado");
      callback();
    }
  }
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
    content: "/";
    padding: 0 0.5rem;
    color: gray;
  }
}
.breadcrumbs__status {
  font-size: 0.9rem;
  padding-top: 2px;
  padding-bottom: 2px;
  &.color-draft {
    background-color: #ffca28;
  }
  &.color-published {
    background-color: #e0e0e0;
  }
}
.right-box {
  list-style: none;
  padding: 0;
}
.right-box__item {
  &:only-child {
    border-bottom: 1px solid #e0e0e0;
  }
  & + .right-box__item {
    border-top: 1px solid #e0e0e0;
  }
}
.venue-draft {
  font-style: italic;
}
</style>
