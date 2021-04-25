<template>
  <div class="flex column side-bar-container">
    <h1>Gazorpafy</h1>
    <div class="flex column full">
      <router-link
        v-for="link in links"
        :key="link.id"
        :to="link.href"
        class="flex center"
      >
        <div>
          <span :class="`material-icons ${link.iconName}`">
            {{ link.iconName }}
          </span>
          <span>{{ link.txt }}</span>
        </div>
      </router-link>
    </div>
    <img v-if="songInfo.albumImage" :src="songInfo.albumImage.url" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { id: 'l1', href: '/gazorpafy/home', iconName: 'home', txt: 'Home' },
        { id: 'l2', href: '/gazorpafy/browse', iconName: 'inventory', txt: 'Browse' },
        { id: 'l3', href: '/gazorpafy/radio', iconName: 'sensors', txt: 'Radio' },
      ]
    }
  },
  computed: {
    songInfo() {
      return this.$store.getters.songInfo;
    },
  },
  created() {
    console.log('route', this.$route);
  },
}
</script>