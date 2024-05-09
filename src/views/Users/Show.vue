<template>
  <v-layout v-if="!user.id" justify-center align-center fill-height>
    <v-progress-circular :size="48" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div v-else class="w-100 py-6 px-12">
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/usuarios/" class="breadcrumbs__link"
          ><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon>
          Usuarios</router-link
        >{{ user.name }}
        <v-spacer></v-spacer>
        <v-btn text default color="error" @click="deleteUser()">Eliminar</v-btn>
      </v-col>
    </v-row>
    <v-row>
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

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editUser"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li class="py-2"><span class="font-weight-bold">Id:</span> {{ user.id }}</li>
              <li class="py-2"><span class="font-weight-bold">Nombre:</span> {{ user.name }}</li>
              <li class="py-2"><span class="font-weight-bold">Rol:</span> {{ user.role.name }}</li>
              <li class="py-2"><span class="font-weight-bold">E-mail:</span> {{ user.email }}</li>
              <li v-if="user.role.name === 'Colaborador'" class="py-2">
                <span class="font-weight-bold">Servicios:</span>
                <span v-if="user.services.length">
                  {{ user.services.map(s => s.name).join(", ") }}</span
                ><span v-else> Aun no se le asignan servicios</span>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import User from "../../models/User";
import Form from "../Utils/Form";

export default {
  name: "ShowUser",
  components: {
    Form
  },
  beforeMount() {
    this.$http
      .get(process.env.VUE_APP_API_DOMAIN + "api/users/" + this.$route.params.id)
      .then(response => {
        this.user.set(response.data);
        this.editUser = _.cloneDeep(this.user);
      });
  },
  data() {
    return {
      user: new User(),
      editUser: null,
      dialog: false
    };
  },
  methods: {
    deleteUser() {
      if (confirm("¿Esta seguro de eliminar este usuario?")) {
        this.$http
          .post(process.env.VUE_APP_API_DOMAIN + "api/users/delete", {
            id: this.$route.params.id
          })
          .then(response => {
            this.$toast.success("Usuario eliminado");
            this.$router.push("/usuarios");
          });
      }
    },
    closeModal() {
      this.dialog = false;
      this.editUser = _.cloneDeep(this.user);
    },
    updated(user, callback) {
      this.user.set(user);
      this.closeModal();
      this.$toast.success("Usuario actualizado");
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
</style>
