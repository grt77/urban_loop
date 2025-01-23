<template>
  <div class="spinner-container">
      <div class="spinner-border text-primary"></div>
      <div v-if="label" class="label">{{ label }}</div>
  </div>
</template>
<script>
export default {
  name: "Loader",
  props: {
    label: {
      type: String,
      default: ''
    },
  },
}
</script>
<style lang="scss" scoped>
.spinner-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;

  .label {
    width: 80%;
  }
}
</style>