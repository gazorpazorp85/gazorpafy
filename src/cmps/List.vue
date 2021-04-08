<template>
  <div class="preview-container" v-if="items && items.length > 0">
    <Preview
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script>

import Preview from './Preview';

export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  components: {
    Preview
  }
}
</script>