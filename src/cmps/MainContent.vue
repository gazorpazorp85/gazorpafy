<template>
  <div v-if="playlist">
    <div class="flex align-center list-header">
      <div class="capitalize title">{{ playlist.title }}</div>
      <div class="navigation-container">
        <span @click="setIdx(-6)" class="material-icons"> arrow_back_ios </span>
        <span @click="setIdx(6)" class="material-icons">
          arrow_forward_ios
        </span>
      </div>
    </div>
    <List :items="itemsToShow" :type="playlist.type"></List>
  </div>
</template>


<script>
import _ from 'lodash';

import List from './List';
import Preview from './Preview';

export default {
  props: {
    playlist: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      idx: 0
    }
  },
  methods: {
    setIdx(value) {
      if (value < 0 && this.idx + value < 0) return;
      if (value > 0 && this.idx + value >= this.playlist.items.length) return;
      this.idx += value;
    }
  },
  computed: {
    itemsToShow() {
      const items = _.cloneDeep(this.playlist.items);
      return items.slice(this.idx, this.idx + 6);
    }
  },
  components: {
    List,
    Preview
  }
}
</script>