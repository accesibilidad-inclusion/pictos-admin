import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard/Index.vue';
import Services from '../views/Services/Index.vue';
import ShowService from '../views/Services/Show.vue';
import Venues from '../views/Venues/Index.vue';
import ShowVenue from '../views/Venues/Show.vue';
import VenueEvaluations from '../views/Venues/Evaluations.vue';
import ShowVenueEvaluation from '../views/Venues/ShowEvaluation.vue';
import Evaluations from '../views/Evaluations/Index.vue';
import ShowEvaluation from '../views/Evaluations/Show.vue';
import Tasks from '../views/Tasks/Index.vue';
import ShowTask from '../views/Tasks/Show.vue';
import Step from '../views/Tasks/Step.vue';
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
      path: '/lugares/:id/evaluaciones',
      name: 'VenueEvaluations',
      component: VenueEvaluations,
    },
    {
      path: '/lugares/evaluacion/:id',
      name: 'ShowVenueEvaluation',
      component: ShowVenueEvaluation,
    },
    {
      path: '/evaluaciones',
      name: 'Evaluations',
      component: Evaluations,
    },
    {
      path: '/evaluaciones/:id',
      name: 'ShowEvaluation',
      component: ShowEvaluation,
    },
    {
      path: '/tareas',
      name: 'Tasks',
      component: Tasks,
    },
    {
      path: '/tareas/nuevo_paso',
      name: 'Step',
      component: Step,
    },
    {
      path: '/tareas/paso/:id',
      name: 'Step',
      component: Step
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
