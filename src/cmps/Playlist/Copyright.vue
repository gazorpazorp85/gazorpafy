<template>
  <small>
    {{ copyrightFormat }}
  </small>
</template>

<script>
export default {
  props: {
    copyright: {
      type: Object,
      required: true
    },
  },
  computed: {
    copyrightFormat() {
      const symbol = this.copyright.type === 'C' ? '©' : '℗'
      const formatedCopy = this.copyright.text.includes(`(${this.copyright.type})`) ?
        this.copyright.text.replace(`(${this.copyright.type})`, symbol) :
        `${symbol} ${this.copyright.text}`;
      return formatedCopy
    }
  }
}
</script>