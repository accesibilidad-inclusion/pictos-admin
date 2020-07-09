<template>
  <v-layout v-if="!user.id" justify-center>
    <v-progress-circular
      :size="70"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-layout>
  <div v-else>
    <v-row class="mb-3">
      <v-col cols="12" class="d-flex align-center breadcrumbs">
        <router-link to="/usuarios/" class="breadcrumbs__link"><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Usuarios</router-link>{{ user.name }}
        <span class="breadcrumbs__status color-published mx-3 px-3">{{ user.status }}</span>
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
              <li class="py-2"><span class="font-weight-bold">Nombre:</span> {{ user.name }}</li>
              <li class="py-2"><span class="font-weight-bold">Categoria:</span> {{ user.category.name }}</li>
              <li v-if="user.url != ''" class="py-2"><span class="font-weight-bold">Url:</span> <a target="_blank" :href="user.url">{{ user.url }}</a></li>
              <li class="py-2"><span class="font-weight-bold">Id:</span> {{ user.id }}</li>
              <li v-if="user.tags.length" class="py-2"><span class="font-weight-bold">Sinonimos:</span> {{ user.tags.join(', ') }}</li>
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
          <v-card-text class="pa-0">
            <ul class="right-box">
              <li v-for="(venue, index) in user.venues" v-bind:key="index" class="right-box__item px-9 py-4">
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
