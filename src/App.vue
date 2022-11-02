<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app v-if="isLoggedIn">
      <v-list height="100%">
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
        <v-list-item v-if="user.role.name === 'Administrador'" link to="/usuarios">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Usuarios</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link dense href="https://forms.gle/QdbvD3CgSrxN9VZS6" target="_blank" class="list-item__bottom">
          <v-list-item-action>
            <v-icon>mdi-comment-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Envianos tus sugerencias</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark v-if="isLoggedIn">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>PICTOS Admin</v-toolbar-title>
      <div class="profile">
        <transition name="bounce-avatar">
          <div class="avatar" @click="openAvatar" v-if="!showProfile">
            {{
              user.name.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), "")
            }}
          </div>
        </transition>
        <transition name="bounce-menu">
          <div
            class="settings px-10 py-7"
            v-if="showProfile"
            v-click-outside="closeAvatar"
            tabindex="-1"
            ref="avatarEl"
            @keyup.esc="showProfile = false"
          >
            <button
              type="button"
              @click="showProfile = false"
              class="close grey--text text--darken-4"
              aria-label="Close"
            >
              <v-icon class="grey--text text--darken-1">mdi-close</v-icon>
            </button>
            <div class="main">
              <div class="avatar-menu black--text">
                {{
                  user.name
                    .split(/\s/)
                    .reduce((response, word) => (response += word.slice(0, 1)), "")
                }}
              </div>
              <div class="main-info ms-10 ps-4">
                <div class="main-info__names grey--text text--darken-4">{{ user.name }}</div>
              </div>
            </div>
            <div class="personal-info ms-10 ps-4">
              <div class="black--text">
                <label>E-mail</label>
                {{ user.email }}
              </div>
            </div>
            <div class="options ms-10 ps-4">
              <div class="profile-opt">
                <span @click="showProfile = false" class="blue--text text--darken-2"
                  >Cambiar contraseña</span
                >
              </div>
              <div class="profile-opt">
                <span @click="logout" class="blue--text text--darken-2">Cerrar sesión</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </v-app-bar>

    <v-content>
      <v-container fluid :fill-height="!isLoggedIn">
        <router-view :key="$route.fullPath"></router-view>
      </v-container>
    </v-content>
    <!-- <v-footer app>
      <span class="white--text">&copy; 2019</span>
    </v-footer> -->
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
        if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout").then(() => {
            this.$router.push("/login");
          });
        }
        throw err;
      });
    });
    if (this.isLoggedIn) {
      this.$store.dispatch("setRoles");
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
  &:hover:before {
    content: "";
    opacity: 0.08;
    height: 42px;
    width: 42px;
    position: absolute;
    background: white;
    border-radius: 50%;
    /* transition-duration: 0.28s; */
    /* transition-property: box-shadow, transform, opacity; */
    /* transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); */
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
  }
}
.settings .main {
  position: relative;
}
.settings .main .avatar-menu {
  border-radius: 50%;
  height: 42px;
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  text-transform: uppercase;
  position: absolute;
}
.settings {
  background: white;
  border-radius: 13px;
  transform-origin: 100% 0%;
  width: 400px;
  top: -10px;
  left: -390px;
  position: absolute;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 99999;
  font-weight: 300;
  outline: none;
}
.settings .close {
  position: absolute;
  top: 1rem;
  right: 2rem;
  outline: none;
  width: 30px;
  height: 30px;
  z-index: 10;
}
.main-info__names {
  font-weight: 400;
  font-size: 16px;
  text-transform: capitalize;
}
.avatar-menu {
  background: lightgray;
}
.settings .personal-info {
  font-size: 14px;
}
.settings .personal-info label {
  font-weight: 400;
  width: 20%;
}
.settings .options {
  border-top: 1px solid lightgray;
  padding-top: 0.5rem;
  margin-top: 0.8rem;
}
.profile-opt {
  padding: 0.3rem 0;
  font-size: 14px;
  &:before {
    content: "";
    background: gray;
    width: 24px;
    height: 24px;
    margin-right: 0.3rem;
  }
}
.profile-opt span {
  cursor: pointer;
}
.profile-opt span:hover {
  cursor: pointer;
  opacity: 0.87;
}
.list-item__bottom {
  position: absolute;
  bottom: 0px;
  width: 100%;
}
</style>
