<template>
  <div
    class="preview-grid"
    :class="!previewToRender ? 'browse-grid' : ''"
    v-if="items && items.length > 0"
  >
    <template v-if="previewToRender">
      <Preview
        v-for="item in items"
        :key="item.id"
        :item="item"
        :isNewRelease="isNewRelease"
      />
    </template>
    <template v-else>
      <BrowsePreview v-for="item in items" :key="item.id" :item="item" />
    </template>
  </div>
</template>

<script>

import BrowsePreview from './Browse/BrowsePreview';
import Preview from './Preview';

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    isNewRelease: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    previewToRender() {
      return this.type !== 'browseCategory';
    }
  },
  components: {
    BrowsePreview,
    Preview
  }
}
</script>