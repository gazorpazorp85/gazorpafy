<template>
  <div class="flex column copyright-container">
    <small v-if="copyrightsToShow">
      {{ copyrightsFormat }}
    </small>
    <small v-else v-for="(copyright, idx) in copyrights" :key="idx">
      {{ copyrightFormat(copyright) }}
    </small>
  </div>
</template>

<script>
export default {
  props: {
    copyrights: {
      type: Array,
      required: true
    },
  },
  computed: {
    copyrightsToShow() {
      const textToCompare = this.copyrights[0].text;
      return this.copyrights.every(copyright => copyright.text === textToCompare);
    },
    copyrightsFormat() {
      const textToCompare = this.copyrights[0].text;
      const txt = this.copyrights.reduce((acc, copyright) => acc += copyright.type === 'C' ? '© ' : '℗ ', '');
      return txt + textToCompare.replace(`(${this.copyrights[0].type})`, '');
    },
    copyrightFormat(copyright) {
      return copyright => {
        const symbol = copyright.type === 'C' ? '©' : '℗'
        const formatedCopy = copyright.text.includes(`(${copyright.type})`) ?
          copyright.text.replace(`(${copyright.type})`, symbol) :
          `${symbol} ${copyright.text}`;
        return formatedCopy
      }
    },
  }
}
</script>