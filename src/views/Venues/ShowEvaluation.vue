<template>
  <v-layout v-if="!evaluation" justify-center>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <div v-else class="py-6 px-12">
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/lugares/" class="breadcrumbs__link">
          <v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Lugares
        </router-link>
        <router-link :to="'/lugares/' + evaluation.venue.id" class="breadcrumbs__link">
          {{ evaluation.venue.name }}
        </router-link>
        <router-link :to="'/lugares/' + evaluation.venue.id + '/evaluaciones'" class="breadcrumbs__link">
          Evaluaciones
        </router-link>
        {{ evaluation.id }}
        <v-spacer></v-spacer>
        <!--v-btn text default  color="error" @click="deleteVenue()">Eliminar</v-btn-->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-for="answer in evaluation.answers" v-bind:key="answer.id">
        <b>{{ answer.question.text }}</b>
        <p v-if="answer.question.answer_type != 'Fotografía'" class="pt-2 grey--text text--darken-3">{{ answer.answer }}</p>
        <p v-else class="mt-4">
          <img :src="answer.answer" />
        </p>
        <v-divider></v-divider>
      </v-col>
    </v-row>
  </div>
</template>

<script>

export default {
  name: 'ShowVenueEvaluation',
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/evaluations/'+this.$route.params.id).then((response) => {
      this.evaluation = response.data;
    });
  },
  data() {
    return {
      evaluation: null
    };
  },
  methods: {

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
</style>
