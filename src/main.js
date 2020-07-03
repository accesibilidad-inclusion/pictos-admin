window._ = require('lodash');

import Vue from 'vue';
import App from './App.vue';
import router from './js/router';
import store from './js/store';
import vuetify from './plugins/vuetify';
import Vuex from 'vuex'
import Axios from 'axios'
import moment from 'moment'

Vue.prototype.moment = moment

Vue.use(Vuex)

Vue.prototype.$http = Axios

Vue.config.productionTip = false

let token = localStorage.getItem( 'token' )

if ( token ) {
  Vue.prototype.$http.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + token
}

// token = document.head.querySelector('meta[name="csrf-token"]')

// Vue.prototype.$http.defaults.headers.common['Content-Type'] = 'application/json'
// Vue.prototype.$http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// if ( token ) {
//     Vue.prototype.$http.defaults.headers.common[ 'X-CSRF-TOKEN' ] = token.content
// } else {
//     console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
// }

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
