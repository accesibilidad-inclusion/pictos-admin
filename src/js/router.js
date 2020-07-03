import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard/Index.vue';
import Services from '../views/Services/Index.vue';
import ShowService from '../views/Services/Show.vue';
import Venues from '../views/Venues/Index.vue';
import ShowVenue from '../views/Venues/Show.vue';
import Tasks from '../views/Tasks/Index.vue';
import ShowTask from '../views/Tasks/Show.vue';
import AddStep from '../views/Tasks/AddStep.vue';
import Users from '../views/Users/Index.vue';
import ShowUser from '../views/Users/Show.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/servicios',
      name: 'Services',
      component: Services,
    },
    {
      path: '/servicios/:id',
      name: 'ShowService',
      component: ShowService,
    },
    {
      path: '/lugares',
      name: 'Venues',
      component: Venues,
    },
    {
      path: '/lugares/:id',
      name: 'ShowVenue',
      component: ShowVenue,
    },
    {
      path: '/tareas',
      name: 'Tasks',
      component: Tasks,
    },
    {
      path: '/tareas/nuevo_paso',
      name: 'AddStep',
      component: AddStep,
    },
    {
      path: '/tareas/:id',
      name: 'ShowTask',
      component: ShowTask,
    },
    {
      path: '/usuarios',
      name: 'Users',
      component: Users,
    },
    {
      path: '/usuarios/:id',
      name: 'ShowUser',
      component: ShowUser,
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
