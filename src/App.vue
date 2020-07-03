<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      v-if="isLoggedIn"
    >
      <v-list>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/servicios">
          <v-list-item-action>
            <v-icon>mdi-folder-marker</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Servicios</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/lugares">
          <v-list-item-action>
            <v-icon>mdi-map-marker</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Lugares</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/tareas">
          <v-list-item-action>
            <v-icon>mdi-alert-circle-check-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Tareas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/usuarios">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Usuarios</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout()">
          <v-list-item-action>
            <v-icon>mdi-folder-marker</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      dark
      v-if="isLoggedIn"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>PICTOS Admin</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
        fluid
      >
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  props: {
    source: String,
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
  },
  created() {
    this.$http.interceptors.response.use(undefined, ( err ) => {
      return new Promise( ( resolve, reject ) => {
        if( err.response.status === 401 && err.config && !err.config.__isRetryRequest ) {
            this.$store.dispatch( 'logout' ).then( () => {
                this.$router.push( '/login' )
            } )
        }
        throw err
      } )
    } )
    if( this.isLoggedIn ) {
        this.$store.dispatch( 'setCategories' )
        this.$store.dispatch( 'setServices' )
        this.$store.dispatch( 'setVenues' )
        this.$store.dispatch( 'setImages' )
    }
  },

  data: () => ({
    drawer: null,
  }),

  methods: {
    logout() {
        this.$store.dispatch( 'logout' ).then( () => {
            this.showProfile = false
            this.$router.push( '/login' )
        } )
    },
  }
};
</script>
