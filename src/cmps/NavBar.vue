<template>
  <div class="flex nav-bar-container">
    <div class="flex nav-bar-container-contents">
      <div class="flex">
        <span @click="changeRoute(-1)" class="material-icons">
          arrow_back_ios
        </span>
        <span @click="changeRoute(1)" class="material-icons">
          arrow_forward_ios
        </span>
      </div>
      <Search @search="search" />
      <UserIcon v-if="loggedInUser" :user="loggedInUser" />
    </div>
  </div>
</template>

<script>

import Search from '@/cmps/Search';
import UserIcon from '@/cmps/UserIcon';

export default {
  methods: {
    search(query) {
      this.$emit('search', query);
    },
    changeRoute(diff) {
      this.$router.go(diff);
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    }
  },
  components: {
    Search,
    UserIcon
  },
  created() {
    this.$store.dispatch('login');
  },
}
</script>

<style>
</style>