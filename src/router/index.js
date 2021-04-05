import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import GazorpafyApp from '../views/GazorpafyApp.vue'

import Details from '../views/Details.vue';
import ListContainer from '../views/ListContainer.vue';
import Playlist from '../views/Playlist.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/gazorpafy',
    name: 'Gazorpafy',
    component: GazorpafyApp,
    children: [
      { path: 'playlist/:id', component: Playlist },
      { path: '', component: ListContainer },
      { path: 'artist/:id', component: Details }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
