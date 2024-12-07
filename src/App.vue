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
  min-height: 90vh;
  background-color: #eaeaea;
  border-radius: 30px;
  padding: 5px;
}
</style>
