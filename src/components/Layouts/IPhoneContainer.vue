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
  width: 100%;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  color: black;

  .screen {
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 30px;
  }
}

// @media (min-width: 360px) and (max-width: 424px) {
//   .iphone-container {
//     width: 325px !important;
//     height: 670px !important;
//   }
// }

// @media (min-width: 425px) and (max-width: 932px) {
//   .iphone-container {
//     width: 420px !important;
//     height: 670px !important;
//   }
// }
</style>
