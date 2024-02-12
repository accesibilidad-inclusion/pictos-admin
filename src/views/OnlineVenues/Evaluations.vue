<template>
  <div class="py-6 px-12">
    <v-row class="mb-3" v-if="venue">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/lugares-en-internet/" class="breadcrumbs__link">
          <v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Lugares en internet
        </router-link>
        <router-link :to="'/lugares-en-internet/' + venue.id" class="breadcrumbs__link">
          {{ venue.name }}
        </router-link>
        Evaluaciones
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col cols="2">
        <v-autocomplete
          append-icon="mdi-magnify"
          placeholder="Buscar"
          cache-items
        >
        </v-autocomplete>
      </v-col>
    </v-row> -->
    <v-layout v-if="!entries" justify-center class="mt-8">
      <v-progress-circular :size="70" color="primary" indeterminate></v-progress-circular>
    </v-layout>
    <v-row v-else>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="entries">
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.app_user.sex }}</td>
                <td>{{ item.app_user.impairments.join(", ") }}</td>
                <td>{{ moment(item.app_user.birthday).format("DD/MM/YYYY") }}</td>
                <td>{{ item.calification }}</td>
                <td>{{ moment(item.created_at).format("DD/MM/YYYY \- HH:mm") }}</td>
                <td>
                  <router-link :to="'/lugares-en-internet/evaluacion/' + item.id"
                    >Ver evaluación</router-link
                  >
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "VenueEvaluations",
  beforeMount() {
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/online_venues/" + this.$route.params.id)
      .then(response => {
        this.venue = response.data;
      });

    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/evaluations/online_venue/" + this.$route.params.id)
      .then(response => {
        this.entries = response.data;
      });
  },
  data() {
    return {
      headers: [
        {
          text: "Id",
          value: "id"
        },
        {
          text: "Sexo",
          value: "sex"
        },
        {
          text: "Discapacidad",
          value: "impairments"
        },
        {
          text: "Nacimiento",
          value: "birthday"
        },
        {
          text: "Evaluacion",
          value: "calification"
        },
        {
          text: "Fecha",
          value: "created_at"
        },
        {
          text: ""
        }
      ],
      entries: null,
      venue: null,
      pagination: {}
    };
  },
  methods: {}
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
