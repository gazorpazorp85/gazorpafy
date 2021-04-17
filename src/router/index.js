import Vue from 'vue'
import VueRouter from 'vue-router'

import Browse from '../views/Browse.vue';
import Details from '../views/Details.vue';
import GazorpafyApp from '../views/GazorpafyApp.vue'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue';
import Playlist from '../views/Playlist.vue';
import Search from '../views/Search.vue';

import PageConstruction from '../cmps/PageConstruction.vue';
import BrowseDetails from '../cmps/Browse/BrowseDetails.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/gazorpafy',
    component: GazorpafyApp,
    children: [
      { path: 'playlist/:id', name: 'playlist', component: Playlist },
      { path: 'artist/:id', name: 'artist', component: Details },
      { path: 'album/:id', name: 'album', component: Playlist },
      { path: 'browse/:id', name: 'browseDetails', component: BrowseDetails },
      { path: 'browse', name: 'browse', component: Browse },
      { path: 'search', name: 'search', component: Search },
      { path: 'home', component: Main },
      { path: '*', component: PageConstruction },
    ]
  },
  {
    path: '/',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
