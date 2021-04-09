import Vue from 'vue'
import VueRouter from 'vue-router'

import Details from '../views/Details.vue';
import GazorpafyApp from '../views/GazorpafyApp.vue'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue';
import Playlist from '../views/Playlist.vue';

import PageConstruction from '../cmps/PageConstruction.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/gazorpafy',
    component: GazorpafyApp,
    children: [
      { path: 'playlist/:id', name: 'playlist', component: Playlist },
      { path: 'artist/:id', name: 'artist', component: Details },
      { path: 'album/:id', name: 'album', component: Playlist },
      { path: '', component: Main },
      { path: '*', component: PageConstruction },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
