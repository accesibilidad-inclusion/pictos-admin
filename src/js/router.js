import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login.vue";
import RecoverPassword from "../views/RecoverPassword.vue";
import Dashboard from "../views/Dashboard/Index.vue";

import Services from "../views/Services/Index.vue";
import ShowService from "../views/Services/Show.vue";

import PresentialVenues from "../views/PresentialVenues/Index.vue";
import ShowPresentialVenue from "../views/PresentialVenues/Show.vue";
import PresentialVenueEvaluations from "../views/PresentialVenues/Evaluations.vue";
import ShowPresentialVenueEvaluation from "../views/PresentialVenues/ShowEvaluation.vue";

import OnlineVenues from "../views/OnlineVenues/Index.vue";
import ShowOnlineVenue from "../views/OnlineVenues/Show.vue";
import OnlineVenueEvaluations from "../views/OnlineVenues/Evaluations.vue";
import ShowOnlineVenueEvaluation from "../views/OnlineVenues/ShowEvaluation.vue";

import PresentialEvaluations from "../views/Evaluations/Presential.vue";
import OnlineEvaluations from "../views/Evaluations/Online.vue";
import ShowPresentialEvaluation from "../views/Evaluations/ShowPresential.vue";
import ShowOnlineEvaluation from "../views/Evaluations/ShowOnline.vue";

import PresentialTasks from "../views/PresentialTasks/Index.vue";
import ShowPresentialTask from "../views/PresentialTasks/Show.vue";
import PresentialStep from "../views/PresentialTasks/Step.vue";

import Users from "../views/Users/Index.vue";
import ShowUser from "../views/Users/Show.vue";

import OnlineTasks from "../views/OnlineTasks/Index.vue";
import ShowOnlineTask from "../views/OnlineTasks/Show.vue";
import OnlineStep from "../views/OnlineTasks/Step.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/recuperar_password/:hash",
      name: "RecoverPassword",
      component: RecoverPassword
    },
    {
      path: "/servicios",
      name: "Services",
      component: Services
    },
    {
      path: "/servicios/:id",
      name: "ShowService",
      component: ShowService
    },
    {
      path: "/lugares-presenciales",
      name: "Venues",
      component: PresentialVenues
    },
    {
      path: "/lugares-presenciales/:id",
      name: "ShowVenue",
      component: ShowPresentialVenue
    },
    {
      path: "/lugares-presenciales/:id/evaluaciones",
      name: "VenueEvaluations",
      component: PresentialVenueEvaluations
    },
    {
      path: "/lugares-presenciales/evaluacion/:id",
      name: "ShowVenueEvaluation",
      component: ShowPresentialVenueEvaluation
    },
    {
      path: "/evaluaciones-presenciales",
      name: "PresentialEvaluations",
      component: PresentialEvaluations
    },
    {
      path: "/evaluaciones-en-internet",
      name: "OnlineEvaluations",
      component: OnlineEvaluations
    },
    {
      path: "/evaluaciones-presenciales/:id",
      name: "ShowPresentialEvaluation",
      component: ShowPresentialEvaluation
    },
    {
      path: "/evaluaciones-en-internet/:id",
      name: "ShowOnlineEvaluation",
      component: ShowOnlineEvaluation
    },
    {
      path: "/tareas-presenciales",
      name: "PresentialTasks",
      component: PresentialTasks
    },
    {
      path: "/tareas-presenciales/:task_id/paso/:id?",
      name: "PresentialStep",
      component: PresentialStep
    },
    {
      path: "/tareas-presenciales/:id",
      name: "ShowPresentialTask",
      component: ShowPresentialTask
    },
    {
      path: "/usuarios",
      name: "Users",
      component: Users
    },
    {
      path: "/usuarios/:id",
      name: "ShowUser",
      component: ShowUser
    },
    {
      path: "/lugares-en-internet",
      name: "OnlineVenues",
      component: OnlineVenues
    },
    {
      path: "/lugares-en-internet/:id",
      name: "ShowOnlineVenue",
      component: ShowOnlineVenue
    },
    {
      path: "/lugares-en-internet/:id/evaluaciones",
      name: "VenueEvaluations",
      component: OnlineVenueEvaluations
    },
    {
      path: "/lugares-en-internet/evaluacion/:id",
      name: "ShowVenueEvaluation",
      component: ShowOnlineVenueEvaluation
    },
    {
      path: "/tareas-en-internet",
      name: "OnlineTasks",
      component: OnlineTasks
    },
    {
      path: "/tareas-en-internet/:id",
      name: "ShowOnlineTask",
      component: ShowOnlineTask
    },
    {
      path: "/tareas-en-internet/:online_task_id/paso/:id?",
      name: "OnlineStep",
      component: OnlineStep
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.name == "login") {
    if (store.getters.isLoggedIn) {
      next("/");
      return;
    }
    next();
  } else if (to.meta.requiresAuth) {
    if (store.getters.isLoggedIn && to.meta.roles.indexOf(store.getters.user.role) > -1) {
      next();
      return;
    }
    next("/");
  } else if (!to.name) {
    if (store.getters.isLoggedIn) {
      next("/");
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
