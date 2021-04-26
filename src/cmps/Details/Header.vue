<template>
  <div class="flex column">
    <div class="flex artist-info">
      <img class="artist-img" :src="artist.images[0].url" alt="" />
      <h1>{{ artist.name }}</h1>
    </div>
    <div class="flex column details-nav-bar">
      <div class="flex">
        <button class="play">play</button>
        <button>follow</button>
      </div>
      <CmpsNavBar
        :endpoints="endpoints"
        :selected="endpoint"
        @go="emitEndpoint"
      />
    </div>
  </div>
</template>

<script>
import CmpsNavBar from '@/cmps/CmpsNavBar';

import { socketService } from '@/services/socket.service';

export default {
  props: {
    artist: {
      type: Object,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    }
  },
  methods: {
    emitEndpoint(value) {
      socketService.emit('go', value);
    }
  },
  computed: {
    endpoints() {
      return [
        { name: 'overview', title: 'overview' },
        { name: 'fans', title: 'fans also like' }
      ]
    },
  },
  components: {
    CmpsNavBar
  }
}
</script>