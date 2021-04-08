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
      <!-- <div class="flex">
        <div class="uppercase">overview</div>
        <div class="uppercase">fans also like</div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artist: {
      type: Object,
      required: true
    }
  }
}
</script>