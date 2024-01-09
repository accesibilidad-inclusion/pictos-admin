<template>
  <v-layout v-if="!evaluation" justify-center>
    <v-progress-circular :size="70" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div v-else class="py-6 px-12">
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link :to="'/evaluaciones-en-internet/'" class="breadcrumbs__link">
          <v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Evaluaciones
        </router-link>
        {{ evaluation.id }}
        <v-spacer></v-spacer>
        <!--v-btn text default  color="error" @click="deleteVenue()">Eliminar</v-btn-->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-for="answer in evaluation.answers" v-bind:key="answer.id">
        <div v-html="answer.question.text"></div>
        <p
          v-if="answer.question.answer_type != 'Fotografía'"
          class="pt-2 grey--text text--darken-3"
        >
          {{ answer.answer }}
        </p>
        <p v-else class="mt-4">
          <img :src="answer.answer" class="evaluation-img" />
        </p>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-btn
      v-if="this.$store.getters.user.role.name === 'Administrador'"
      default
      color="error"
      @click="deleteEvaluation()"
      >Eliminar</v-btn
    >
  </div>
</template>

<script>
export default {
  name: "ShowEvaluation",
  beforeMount() {
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/evaluations/" + this.$route.params.id)
      .then(response => {
        this.evaluation = response.data;
      });
  },
  data() {
    return {
      evaluation: null
    };
  },
  methods: {
    deleteEvaluation() {
      if (confirm("¿Esta seguro de eliminar esta evaluación?")) {
        this.$http
          .post(process.env.VUE_APP_API_DOMAIN + "api/evaluations/delete", {
            id: this.evaluation.id
          })
          .then(response => {
            this.$router.push("/evaluaciones-en-internet");
          });
      }
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
.evaluation-img {
  max-height: 450px;
  width: auto;
  display: block;
}
</style>
