<template>
  <v-layout v-if="!user.id" justify-center>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <div v-else>
    <v-row>
      <v-col cols="12">
        <router-link to="/usuarios/"><v-icon>mdi-chevron-left</v-icon> Usuarios</router-link> | {{ user.name }}
        <span>{{ user.status }}</span>
        <v-btn text small color="error" @click="deleteUser()">Eliminar</v-btn>
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
            <v-dialog
              v-model="dialog"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn text small v-bind="attrs" v-on="on" color="primary">
                  Editar
                </v-btn>
              </template>

              <Form v-on:cancel="closeModal" v-on:updated="updated" :object="editUser" name="usuario" url="/api/users/update" method="put"></Form>
            </v-dialog>
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li>Nombre: {{ user.name }}</li>
              <li>Categoria: {{ user.category.name }}</li>
              <li v-if="user.url != ''">Url: <a target="_blank" :href="user.url">{{ user.url }}</a></li>
              <li>Id: {{ user.id }}</li>
              <li v-if="user.tags.length">Sinonimos: {{ user.tags.join(', ') }}</li>
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
          Este usuario tiene {{ user.venues.length }} lugares
          </v-card-title>
          <v-card-text class="py-5 px-6">
            <ul>
              <li v-for="(venue, index) in user.venues" v-bind:key="index">
                <router-link :to="'/lugares/'+venue.id">{{ index+1 }} {{ venue.name }}</router-link>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="user.status == 'Borrador'">
      <v-col cols="12">
        Este usuario esta en borrador <v-btn text small @click="publishUser()">Publicar</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import User from '../../models/User'
import Form from '../Utils/Form'

export default {
  name: 'ShowUser',
  components: {
    Form
  },
  beforeMount() {
    this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/users/'+this.$route.params.id).then((response) => {
      this.user.set(response.data);
      this.editUser = _.clone( this.user  )
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
      if(confirm('¿Esta seguro de eliminar este usuario?')) {
        this.$http.post(process.env.VUE_APP_API_DOMAIN + 'api/users/delete', {
          'id': this.$route.params.id
        }).then((response) => {
          this.$router.push('/usuarios');
        });
      }
    },
    publishUser() {
      if(confirm('¿Esta seguro de publicar este usuario?')) {
        this.$http.put(process.env.VUE_APP_API_DOMAIN + 'api/users/publish', {
          'id': this.$route.params.id
        }).then((response) => {
          if(response.data)
            this.user.status = 'Publicado';
        });
      }
    },
    closeModal() {
      this.dialog = false;
      this.editUser = _.clone( this.user );
    },
    updated() {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/users/'+this.$route.params.id).then((response) => {
        this.user.set(response.data);
        this.editUser = _.clone( this.user  )
        this.closeModal();
      });
    }
  },
};
</script>
<style lang="scss" scoped>
  .v-card {
    height: 100%;
  }
</style>
