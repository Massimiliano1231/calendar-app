import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/userLogin.vue'; 
import nuovoUtente from '../views/registratiAccedi.vue'
import HomePrincipale from '../views/HomePrincipale.vue';
import ToDoApp from '../views/ToDoApp.vue'; 
import activities from '../views/ActivitiesPage.vue'
import addActivities from '../views/addActivities.vue'
import addEvent from '../views/addEvent.vue'
import calendarEvent from '../views/calendarEvent.vue'
import eventsE from '../views/eventsE.vue'
import pomodoroTempo from '../views/pomodoroTempo.vue'
import pomSession from '../views/pomSession.vue'
import editNote from '../views/editNote.vue';
import accountUtente from '@/views/accountUtente.vue';
import eventDayCalendar from '@/views/eventDayCalendar.vue';



const routes = [
  {
    path: '/',
    name: 'userLogin',
    component: UserLogin,
  },

  {
    path: '/accountUtente',
    name: 'accountUtente',
    component: accountUtente,
    meta: { requiresAuth: true } 
  },

  {
    path: '/eventDayCalendar',
    name: 'eventDayCalendar',
    component: eventDayCalendar,
    meta: { requiresAuth: true } 
  },

  {
    path: '/registratiAccedi',
    name: 'nuovoUtente',
    component: nuovoUtente,
  },

  {
    path: '/homePrincipale',
    name: 'HomePrincipale',
    component: HomePrincipale ,
    meta: { requiresAuth: true } 
  },


  {
    path: '/todo',
    name: 'ToDoApp',
    component: ToDoApp,
    meta: { requiresAuth: true } 

  },

  {
    path: '/edit-note/:id',
    name: 'editNote',
    component: editNote,
    meta: { requiresAuth: true } 
  },


  {
    path: '/activities',
    name: 'activities',
    component: activities,
    meta: { requiresAuth: true } 
  },

  {
    path: '/addActivities',
    name: 'addActivities',
    component: addActivities,
    meta: { requiresAuth: true } 
  },

  {
    path: '/addEvent',
    name: 'addEvent',
    component: addEvent,
    meta: { requiresAuth: true } 
  },

  {
    path: '/calendarEvent',
    name: 'calendarEvent',
    component: calendarEvent,
    meta: { requiresAuth: true } 
  },


  {
    path: '/eventsE',
    name: 'eventsE',
    component: eventsE,
    meta: { requiresAuth: true } 
  },


  {
    path: '/pomodoroTempo',
    name: 'pomodoroTempo',
    component: pomodoroTempo,
    meta: { requiresAuth: true } 
  },

  {
    path: '/pomSession',
    name: 'pomSession',
    component: pomSession,
    meta: { requiresAuth: true } 
  },


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (!token) {
      next({
        path: '/',
        query: { redirect: to.fullPath } 
      });
    } else {
      next(); 
    }
  } else {
    next(); 
  }
});





export default router;
