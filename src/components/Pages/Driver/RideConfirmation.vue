<template>
  <div class="row confirmation-container">
    <div class="col-xs-12 logo-container">
      <img :src="images.logo" alt="Urban Loop Logo" class="urban-loop-logo" />
    </div>
    <div class="col-xs-12 logo-container">
      <img :src="images.flashRideLogo" alt="Flash Ride Logo" class="flash-ride-logo" />
    </div>
    <div class="col-xs-12 map-container">
      <booking-map
        v-if="initializeMap"
        :source-details="sourceCoordinates"
        :destination-details="destinationCoordinates"
      />
    </div>
    <div class="col-xs-12 travel-info">
      <div>Estimated Travel Time: 11 Mins</div>
    </div>
    <div class="col-xs-12">
      <button class="btn btn-primary rounded-1 w-100">Slide to End Ride</button>
    </div>
    <div class="col-xs-12 mt-3 heading-info">
      <span class="fw-bold">Heading Towards:</span> XXXXXXXX
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { images } from '../../../assets/images';
import Mapbox from '../../Widgets/Mapbox.vue';
import BookingMap from '../../Widgets/BookingMap.vue';

export default {
  name: 'RideConfirmation',
  components: {
    Mapbox,
    BookingMap
  },
  data() {
    return {
      sourceCoordinates: [],
      destinationCoordinates: [],
      images,
      initializeMap: false,
    };
  },
  computed: {
    ...mapGetters({
      currentRideDetails: 'getDriverActiveRideDetails'
    }),
  },
  mounted() {
    this.initializeMap = false;
    this.sourceCoordinates = [this.currentRideDetails?.origin_long, this.currentRideDetails?.origin_lat];
    this.destinationCoordinates = [this.currentRideDetails?.dest_long, this.currentRideDetails?.dest_lat];
    this.initializeMap = true;
  }
};
</script>

<style lang="scss">
.confirmation-container {
  .logo-container {
    display: flex;
    justify-content: flex-start;
    margin-left: -10px;

    .urban-loop-logo {
      width: 50%;
    }

    .flash-ride-logo {
      width: 100%;
    }
  }

  .map-container {
    position: relative;
    width: 100%;
    height: 300px;
    border: 2px solid #ccc;
    border-radius: 5px;
  }

  .travel-info {
    display: flex;
    justify-content: center;
    margin-top: 10px;

    div {
      width: 70%;
      font-size: 17px;
      font-weight: 600;
      font-family: Arial, Helvetica, sans-serif;
      text-align: center;
    }
  }

  .heading-info {
    display: flex;
    justify-content: flex-start;
    font-size: 15px;
    margin-left: 15px;
  }
}
</style>
