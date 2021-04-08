import Vue from 'vue'
import VueRouter from 'vue-router'

import Details from '../views/Details.vue';
import GazorpafyApp from '../views/GazorpafyApp.vue'
import Home from '../views/Home.vue'
import UserData from '../views/UserData.vue';
import Playlist from '../views/Playlist.vue';

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
      { path: 'playlist/:id', component: Playlist },
      { path: 'artist/:id', component: Details },
      { path: 'album/:id', component: Playlist },
      { path: '', component: UserData },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
