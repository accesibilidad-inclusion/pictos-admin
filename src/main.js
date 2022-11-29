window._ = require("lodash");

import Vue from "vue";
import App from "./App.vue";
import router from "./js/router";
import store from "./js/store";
import vuetify from "./plugins/vuetify";
import Vuex from "vuex";
import Axios from "axios";
import moment from "moment";
import * as VueGoogleMaps from "vue2-google-maps-withscopedautocomp";
import { TiptapVuetifyPlugin } from "tiptap-vuetify";
// don't forget to import CSS styles
import "tiptap-vuetify/dist/main.css";
// Vuetify's CSS styles
import "vuetify/dist/vuetify.min.css";

Vue.prototype.moment = moment;

Vue.use(Vuex);

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY,
    libraries: "places" // necessary for places input
  }
});

Vue.prototype.$http = Axios;

Vue.config.productionTip = false;

let token = localStorage.getItem("token");

if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = "Bearer " + token;
}

// token = document.head.querySelector('meta[name="csrf-token"]')

// Vue.prototype.$http.defaults.headers.common['Content-Type'] = 'application/json'
// Vue.prototype.$http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// if ( token ) {
//     Vue.prototype.$http.defaults.headers.common[ 'X-CSRF-TOKEN' ] = token.content
// } else {
//     console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
// }

Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: "mdi"
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
