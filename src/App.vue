<template>
  <div class="app">
    <IPhoneContainer>
      <router-view></router-view>
    </IPhoneContainer>
  </div>
</template>

<script>
import IPhoneContainer from "./components/Layouts/IPhoneContainer.vue";

export default {
  components: {
    IPhoneContainer,
  },
};
</script>

<style>
.app {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
