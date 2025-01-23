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
  height: 96vh;
  // border-radius: 30px;
  // border: 10px solid #000;
  background-color: #fff;
  // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
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

@media (min-width: 360px) and (max-width: 424px) {
  .iphone-container {
    width: 325px !important;
    height: 670px !important;
  }
}

@media (min-width: 425px) and (max-width: 932px) {
  .iphone-container {
    width: 420px !important;
    height: 670px !important;
  }
}

.beta-footer {
  width: 290px;
  position: fixed; /* Stick to the bottom */
  bottom: 20px;
  text-align: center;
  color: #333;
  font-size: 14px;
}

</style>
