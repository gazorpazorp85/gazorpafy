<template>
  <div class="browse-container">
    <div class="main-container preview-container">
      <h1>Browse</h1>
      <CmpsNavBar :endpoints="endpoints" :selected="getEndpoint.name" @go="endpointHandler" />
      <div class="subtitle-container">
        {{ getEndpoint.title }}
      </div>
      <List
        :items="getItems"
        v-if="isDefaultViewOn ? categories : newReleases"
        :type="getEndpoint.type"
        :isNewRelease="true"
      />
    </div>
  </div>
</template>

<script>
import List from '@/cmps/List';
import CmpsNavBar from '@/cmps/CmpsNavBar'

import { spotifyService } from '@/services/spotify.service';

export default {
  data() {
    return {
      categories: null,
      newReleases: null,
      endpoint: 'categories',
      featuredPlaylists: null
    }
  },
  methods: {
    async getData() {
      if (this.newReleases && this.categories) return;
      try {
        const url = this.isDefaultViewOn ?
          'browse/categories?limit=50&locale=en_US' :
          'browse/new-releases?limit=50';
        const data = await spotifyService.getData(url);
        if (this.isDefaultViewOn) {
          this.categories = data.categories.items;
        } else {
          this.newReleases = data.albums.items;
        }
      } catch (err) {
        console.log('browse can\'t get item', err);
      }
    },
    endpointHandler(value) {
      if (value === this.endpoint) return;
      this.endpoint = value;
      this.getData();
    },
  },
  computed: {
    endpoints() {
      return [
        { name: 'categories', title: 'genres & moods' },
        { name: 'newReleases', title: 'new releases' }
      ]
    },
    getEndpoint() {
      const endpointsMap = {
        categories: { name: 'categories', type: 'browseCategory', title: 'Genres & Moods' },
        newReleases: { name: 'newReleases', type: 'albums', title: 'New albums & singles' }
      };
      return endpointsMap[this.endpoint];
    },
    getItems() {
      return this[this.endpoint];
    },
    isDefaultViewOn() {
      return this.getEndpoint.name === 'categories';
    }
  },
  components: {
    CmpsNavBar,
    List
  },
  created() {
    this.getData();
  }
}
</script>