<template>
  <div class="row main-container">
    <div class="col-xs-12 text-center">
      <img :src="images.autoRickShaw" width="70px" alt="Auto Rickshaw" />
      <img :src="images.flashRideLogo" width="100%" class="mt-2" alt="Flash Ride Logo" />
      <div class="mt-4">
        <span class="fw-bold">Destination: </span>XXXXXXXX
      </div>
    </div>
    <div class="col-xs-6 col-sm-6 mt-5 text-center">
      <div class="price-info">Other's Avg Price - 100</div>
    </div>
    <div class="col-xs-6 col-sm-6 mt-5 text-center">
      <div class="price-info">Flash Ride Price - 120</div>
    </div>
    <div class="col-xs-6 col-sm-6 mt-5 text-center">
      <button class="btn btn-success rounded-1 px-4 fw-500">Accept</button>
    </div>
    <div class="col-xs-6 col-sm-6 mt-5 text-center">
      <button class="btn btn-danger rounded-1 px-4 fw-500">Reject</button>
    </div>
    <div class="col-xs-12">
      <img :src="images.logo" alt="Urban Loop Logo" class="urban-loop-logo" />
    </div>
  </div>
</template>

<script>
import { images } from '../../../assets/images';

export default {
  name: 'RideDecision',
  data() {
    return {
      images,
    };
  },
};
</script>

<style lang="scss">
.main-container {
  margin-top: 40px;
  font-family: Arial, Helvetica, sans-serif;

  .price-info {
    font-size: 16px;
    font-weight: 700;
  }

  .urban-loop-logo {
    width: 100%;
    position: absolute;
    bottom: 20px;
    left: 0;
  }
}
</style>
