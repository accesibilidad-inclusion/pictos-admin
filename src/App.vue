<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app v-if="isLoggedIn">
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
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark v-if="isLoggedIn">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>PICTOS Admin</v-toolbar-title>
      <div class="profile">
        <transition name="bounce-avatar">
          <div
            class="avatar"
            @click="openAvatar"
            v-if="!showProfile"
          >{{ user.name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'') }}</div>
        </transition>
        <transition name="bounce-menu">
          <div
            class="settings"
            v-if="showProfile"
            v-click-outside="closeAvatar"
            tabindex="-1"
            ref="avatarEl"
            @keyup.esc="showProfile = false"
          >
            <button type="button" @click="showProfile = false" class="close" aria-label="Close">X</button>
            <div class="main">
              <div
                class="avatar-menu"
              >{{ user.name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'') }}</div>
              <div class="main-info">
                <div class="main-info__names">{{ user.name }}</div>
              </div>
            </div>
            <div class="personal-info">
              <div>
                <label>E-mail</label>
                {{ user.email }}
              </div>
            </div>
            <div class="options">
              <div class="profile-opt">
                <span @click="showProfile = false">Cambiar contraseña</span>
              </div>
              <div class="profile-opt">
                <span @click="logout">Cerrar sesión</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  props: {
    source: String
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.getters.user;
    }
  },
  created() {
    this.$http.interceptors.response.use(undefined, err => {
      return new Promise((resolve, reject) => {
        if (
          err.response.status === 401 &&
          err.config &&
          !err.config.__isRetryRequest
        ) {
          this.$store.dispatch("logout").then(() => {
            this.$router.push("/login");
          });
        }
        throw err;
      });
    });
    if (this.isLoggedIn) {
      this.$store.dispatch("setCategories");
      this.$store.dispatch("setServices");
      this.$store.dispatch("setVenues");
      this.$store.dispatch("setImages");
    }
  },

  data: () => ({
    drawer: null,
    showProfile: false
  }),

  methods: {
    openAvatar() {
      this.showProfile = true;
      setTimeout(() => {
        this.$refs.avatarEl.focus();
      }, 300);
    },
    closeAvatar() {
      this.showProfile = false;
    },
    logout() {
      this.$store.dispatch("logout").then(() => {
        this.showProfile = false;
        this.$router.push("/login");
      });
    }
  },
  directives: {
    "click-outside": {
      bind(el, binding, vnode) {
        setTimeout(() => {
          el.clickOutsideEvent = event => {
            if (!(el == event.target || el.contains(event.target))) {
              vnode.context[binding.expression](event);
            }
          };
          document.body.addEventListener("click", el.clickOutsideEvent);
        }, 100);
      },
      unbind(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.profile {
  position: absolute;
  right: 1rem;
  color:black;
}
.avatar {
  border-radius: 50%;
  height: 42px;
  width: 42px;
  top: -21px;
  left: -42px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  text-transform: uppercase;
  position: absolute;
  cursor: pointer;
}
.settings .main {
  display: flex;
  //column-gap: 1rem;
}
.settings .main .avatar-menu {
  border-radius: 50%;
  height: 42px;
  width: 42px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  text-transform: uppercase;
  position: relative;
  margin-right: 0.5rem;
}
.settings {
  background: white;
  border-radius: 13px;
  transform-origin: 100% 0%;
  width: 400px;
  padding: 20px 50px 40px;
  top: -10px;
  left: -390px;
  position: absolute;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 99999;
  font-weight: 300;
}
.settings .close {
  position: absolute;
  top: 1rem;
  right: 2rem;
}
.main-info__names {
    font-weight: 400;
    font-size: 16px;
    text-transform: capitalize;
}
.settings .personal-info {
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    padding: 1.3rem 1.3rem;
    margin: 1rem 0;
    font-size: 14px;
}
.settings .personal-info label{
    font-weight: 400;
    width: 20%;
}
.profile-opt {
    color: darkgray;
    padding: .3rem 0;
    font-size: 14px;
}
.profile-opt span {
    cursor: pointer;
}
.profile-opt span:hover {
    cursor: pointer;
    opacity: .87;
}
</style>