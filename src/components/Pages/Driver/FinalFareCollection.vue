<template>
  <div class="row final-fare-collection-container">
    <div class="col-xs-12 text-center">
      <img :src="images.autoRickShaw" width="70px" alt="Auto Rickshaw" />
      <h1>Flash Ride</h1>
      <!-- <img :src="images.flashRideLogo" width="100%" class="mt-2" alt="Flash Ride Logo" /> -->
      <div class="mt-5 fw-bold fare-message">Please collect the fare amount</div>
      <h2 class="fw-bold fare-amount">₹&nbsp;{{ Math.ceil(currentRideDetails?.price) }}.00</h2>
      <button class="btn btn-success rounded-1 p-3 fw-bold mt-5 px-5" @click="collectAmount">Collected</button>
    </div>
    <div class="col-xs-12">
      <img :src="images.logo" alt="Urban Loop Logo" class="urban-loop-logo" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { images } from '../../../assets/images';

export default {
  name: 'FinalFareCollection',
  data() {
    return {
      images,
    };
  },
  computed: {
    ...mapGetters({
      currentRideDetails: 'getDriverActiveRideDetails'
    }),
  },
  methods: {
    ...mapActions([
      'setDriverActiveRideDetails',
    ]),
    collectAmount() {
      this.setDriverActiveRideDetails({});
      this.$router.push({ name: 'DriverRideDecision' })
    }
  }
};
</script>

<style lang="scss">
.final-fare-collection-container {
  margin-top: 40px;
  font-family: Arial, Helvetica, sans-serif;

  h1 {
    font-family: "Bangers";
    font-size: 50px;
    margin-bottom: 0;
    margin-top: 10px;
  }

  .fare-message {
    width: 70%;
    margin: 0 auto;
    font-size: 20px;
  }

  .fare-amount {
    color: #333;
  }

  .urban-loop-logo {
    width: 100%;
    position: absolute;
    bottom: 20px;
    left: 0;
  }
}
</style>
