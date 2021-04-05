<template>
  <div
    class="flex align-center pointer user-icon-container"
    :class="open"
    @click="toggleOpen"
  >
    <img :src="user.imgUrl" />
    <div>{{ user.fullName }}</div>
    <img
      class="arrow-img"
      :class="open"
      src="../assets/icons/arrow-user-icon.png"
    />
    <div class="user-menu" v-if="isOpen">
      <div class="flex align-center capitalize user-menu-item" @click="logout">
        logout
      </div>
    </div>
  </div>
</template>

<script>

import { authService } from '@/services/auth.service';

export default {
  props: {
    user: {
      type: Object,
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
    async logout() {
      try {
        await authService.logout();
        this.$store.commit({ type: 'loggedInUser', user: null });
        this.$store.commit({ type: 'token', token: null });
        this.$store.commit({ type: 'player', player: null });
        this.$store.commit({ type: 'deviceId', deviceId: null });
        this.$router.push('/');
      } catch (err) {
        console.log('error in logout', err)
      }
    }
  },
  computed: {
    open() {
      return this.isOpen ? 'open' : '';
    }
  }
}
</script>