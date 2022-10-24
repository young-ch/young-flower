<style scoped>

</style>

<template>
  <v-btn
    color="success"
    class="excel-download-button"
    @click="onClick"
  >
    <v-icon
      v-if="icon"
      class="mr-1"
      small
    >{{ icon }}</v-icon>
    <div class="excel-download-buton__text">{{ text }}</div>
  </v-btn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: 'mdi-microsoft-excel',
    },
    text: {
      type: String,
      required: false,
      default: 'Excel 다운로드',
    },
  },
  methods: {
    onClick(e) {
      this.$emit('click', e);
    },
  },
};
</script>