<template>
  <div class="iphone-container">
    <div class="screen">
      <toaster style="width: 100%;" />
      <Loader v-if="isLoading" :label="loadingMessage" />
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { Toaster } from "@steveyuowo/vue-hot-toast";
import Loader from "../Widgets/Loader.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    Toaster,
    Loader,
  },
  computed: {
    ...mapGetters({
      isLoading: 'getLoading',
      loadingMessage: 'getLoadingMessage',
    }),
  },
};
</script>
  
<style lang="scss">
.iphone-container {
  width: 325px;
  height: 93vh;
  border-radius: 30px;
  border: 10px solid #000;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: black;

  .screen {
    width: 100%;
    height: 100%;
    background-color: white; /* Default screen background */
    padding: 30px;
  }
}
</style>
