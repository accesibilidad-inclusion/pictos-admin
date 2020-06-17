import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Services from '../views/Services/Index.vue';
import ShowService from '../views/Services/Show.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/servicios',
      name: 'Servicios',
      component: Services,
    },
    {
      path: '/servicios/:id',
      name: 'ShowService',
      component: ShowService,
    },
  ]
});

router.beforeEach( ( to, from, next ) => {
  if( to.name == 'login') {
      if( store.getters.isLoggedIn ) {
          next('/')
          return
      }
      next()
  }
  else if( to.meta.requiresAuth ) {
      if( store.getters.isLoggedIn && to.meta.roles.indexOf(store.getters.user.role) > -1) {
          next()
          return
      }
      next('/')
  }
  else if( !to.name ) {
      if( store.getters.isLoggedIn ) {
          next('/')
          return
      }
      next('/login')
  }
  else {
      next()
  }
})

export default router;
