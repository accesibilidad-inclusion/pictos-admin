import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    categories: [],
    services: [],
    presential_venues: [],
    online_venues: [],
    roles: [],
    images: [],
    regions: [],
    status: "",
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || {}
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, data) {
      state.status = "success";
      state.token = data.token;
      state.user = data.user;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.user = {};
    },
    setRoles(state, roles) {
      state.roles = roles;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setServices(state, services) {
      state.services = services;
    },
    setPresentialVenues(state, presential_venues) {
      state.presential_venues = presential_venues;
    },
    setOnlineVenues(state, online_venues) {
      state.online_venues = online_venues;
    },
    setImages(state, images) {
      state.images = images;
    },
    setRegions(state, regions) {
      state.regions = regions;
    }
  },
  actions: {
    setRoles({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_API_DOMAIN + "api/roles/list",
          method: "GET"
        }).then(response => {
          commit("setRoles", response.data);
          resolve();
        });
      });
    },
    setCategories({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_API_DOMAIN + "api/categories/list",
          method: "GET"
        }).then(response => {
          commit("setCategories", response.data);
          resolve();
        });
      });
    },
    setServices({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_API_DOMAIN + "api/services/list",
          method: "GET"
        }).then(response => {
          commit("setServices", response.data);
          resolve();
        });
      });
    },
    setPresentialVenues({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_API_DOMAIN + "api/presential_venues/list",
          method: "GET"
        }).then(response => {
          commit("setPresentialVenues", response.data);
          resolve();
        });
      });
    },
    setOnlineVenues({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_API_DOMAIN + "api/online_venues/list",
          method: "GET"
        }).then(response => {
          commit("setOnlineVenues", response.data);
          resolve();
        });
      });
    },
    setImages({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_API_DOMAIN + "api/images",
          method: "GET"
        }).then(response => {
          commit("setImages", response.data);
          resolve();
        });
      });
    },
    setRegions({ commit }) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_API_DOMAIN + "api/regions/list",
          method: "GET"
        }).then(response => {
          commit("setRegions", response.data);
          resolve();
        });
      });
    },
    login({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: process.env.VUE_APP_API_DOMAIN + "api/login",
          data: user,
          method: "POST"
        })
          .then(response => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            Vue.prototype.$http.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.token;
            commit("auth_success", {
              token: response.data.token,
              user: response.data.user
            });
            dispatch("setRoles");
            dispatch("setCategories");
            dispatch("setServices");
            dispatch("setPresentialVenues");
            dispatch("setOnlineVenues");
            dispatch("setImages");
            dispatch("setRegions");
            resolve(response);
          })
          .catch(err => {
            commit("auth_error");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    token: state => state.token,
    user: state => state.user,
    authStatus: state => state.status,
    roles: state => state.roles,
    categories: state => state.categories,
    services: state => state.services,
    presential_venues: state => state.presential_venues,
    online_venues: state => state.online_venues,
    images: state => state.images,
    regions: state => state.regions
  }
});
