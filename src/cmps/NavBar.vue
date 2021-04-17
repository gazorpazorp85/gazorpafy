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
      <SearchInput @search="search" />
      <UserIcon v-if="loggedInUser" :user="loggedInUser" />
    </div>
  </div>
</template>

<script>

import SearchInput from '@/cmps/SearchInput';
import UserIcon from '@/cmps/UserIcon';

export default {
  methods: {
    search(query) {
      this.$router.push({ name: 'search', query: { q: query} })
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
    SearchInput,
    UserIcon
  },
  created() {
    this.$store.dispatch('login');
  },
}
</script>