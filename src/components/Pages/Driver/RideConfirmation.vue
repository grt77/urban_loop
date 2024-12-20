<template>
  <div class="row confirmation-container">
    <div class="col-xs-12 logo-container">
      <img :src="images.logo" alt="Urban Loop Logo" class="urban-loop-logo" />
    </div>
    <div class="col-xs-12 logo-container">
      <img :src="images.flashRideLogo" alt="Flash Ride Logo" class="flash-ride-logo" />
    </div>
    <div class="col-xs-12 booking-map-container">
      <booking-map
        v-if="initializeMap"
        :source-details="sourceCoordinates"
        :destination-details="destinationCoordinates"
        :is-ride-started="isRideStarted"
        height="297px"
      />
      <img :src="images.googleMapIcon" class="google-map-icon" alt="google-map-icon" width="50px" @click="navigateToGoogleMap" />
    </div>
    <!-- <div class="col-xs-12 d-flex justify-content-end">
    </div> -->
    <div class="col-xs-12 travel-info">
      <div><b>Estimated Travel Time: </b>{{ estimatedMinutes }} Mins</div>
    </div>
    <div class="col-xs-12">
      <slide-unlock
        v-if="!isRideStarted"
        ref="rideStartedSlider"
        :auto-width="true"
        :circle="false"
        :width="400"
        :height="50"
        text="Slide to Start Ride"
        success-text="Ride Started"
        @completed="onRideStarted"
      />
      <slide-unlock
        v-else
        ref="rideEndedSlider"
        :auto-width="true"
        :circle="false"
        :width="400"
        :height="50"
        text="Slide to End Ride"
        success-text="Ride Ended"
        @completed="onRideEnded"
      />
    </div>
    <div class="col-xs-12 mt-3 heading-info">
      <span class="fw-bold">Heading Towards:&nbsp;&nbsp;</span> {{ currentRideDetails?.dest_address?.split(', ')[0]}}
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { images } from '../../../assets/images';
import Mapbox from '../../Widgets/Mapbox.vue';
import BookingMap from '../../Widgets/BookingMap.vue';
import FairService from '../../../services/fair.service';
// import SlideButton from 'rn-slide-button';
import SlideUnlock from "@j2only/slide-unlock";
import DriverService from '../../../services/driver.service';

const fairService = new FairService();
const driverService = new DriverService();

export default {
  name: 'RideConfirmation',
  components: {
    Mapbox,
    BookingMap,
    SlideUnlock,
  },
  data() {
    return {
      sourceCoordinates: [],
      destinationCoordinates: [],
      images,
      isRideStarted: false,
      initializeMap: false,
      estimatedMinutes: null,
    };
  },
  computed: {
    ...mapGetters({
      currentRideDetails: 'getDriverActiveRideDetails',
      driverMobileNumber: 'getDriverMobileNumber',
    }),
  },
  mounted() {
    this.initializeMap = false;
    this.sourceCoordinates = [this.currentRideDetails?.origin_longitude, this.currentRideDetails?.origin_latitude];
    this.destinationCoordinates = [this.currentRideDetails?.dest_longitude, this.currentRideDetails?.dest_latitude];
    this.initializeMap = true;
    this.getFairDetails();
    this.getRideInfo();
  },
  methods: {
    ...mapActions([
      'setIsLoading',
      'setLoadingMessage',
    ]),
    async getFairDetails() {
      try {
        this.setIsLoading(true);
        this.setLoadingMessage('Fetching the fair and ride info details. Please wait...');
        const fairPayload = {
          origin_lat: this.sourceCoordinates[1],
          origin_lon: this.sourceCoordinates[0],
          dest_lat: this.destinationCoordinates[1],
          dest_lon: this.destinationCoordinates[0]
        };
        const fairResponse = await fairService.getAutoFare(fairPayload);
        if (fairResponse.status = 200 && fairResponse?.data) {
          this.estimatedMinutes = fairResponse?.data?.duration_minutes || 0;
        }
      } catch (error) {
        toast.error('Failed to fetch fair details. Please try again');
      }
    },
    async getRideInfo() {
      try {
        const rideResponse = await driverService.rideInfo(this.driverMobileNumber);
        if (rideResponse?.status === 200) {
          this.isRideStarted = rideResponse?.data?.ride_status === 'accepted' ? false : true;
        }
      } catch (error) {
        toast.error('Failed to fetch ride info details. Please try again');
      } finally {
        this.setIsLoading(false);
        this.setLoadingMessage('');
      }
    },
    async onRideStarted() {
      try {
        this.setIsLoading(true);
        this.setLoadingMessage('Starting the ride. Please wait...');
        const completeRideResponse = await driverService.stratRide(this.currentRideDetails?.ride_id);
        if (completeRideResponse.status === 200) {
          this.isRideStarted = true;
        }
      } catch (error) {
        toast.error('Failed to start ride. Please try again');
      } finally {
        this.setIsLoading(false);
        this.setLoadingMessage('');
      }
    },
    async onRideEnded() {
      try {
        this.setIsLoading(true);
        this.setLoadingMessage('Ending the ride. Please wait...');
        const completeRideResponse = await driverService.endRide(this.currentRideDetails?.ride_id);
        if (completeRideResponse.status === 200) {
          this.$router.push({ name: 'DriverFinalFareCollection' });
        }
      } catch (error) {
        toast.error('Failed to end ride. Please try again');
      } finally {
        this.setIsLoading(false);
        this.setLoadingMessage('');
      }
    },
    navigateToGoogleMap() {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${this.currentRideDetails?.dest_latitude},${this.currentRideDetails?.dest_longitude}`, '__blank')
    }
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

  .booking-map-container {
    padding: 0;
    position: relative;
    width: 100%;
    height: 300px;
    border: 2px solid #ccc;
    border-radius: 5px;

    .google-map-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      cursor: pointer;
    }
  }

  .travel-info {
    display: flex;
    justify-content: center;
    margin-top: 10px;

    div {
      width: 80%;
      font-size: 17px;
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

.slider-container {
  position: relative;
  width: 300px;
  height: 50px;
  background-color: #ddd;
  border-radius: 25px;
  overflow: hidden;
}
.slider-button {
  position: absolute;
  top: 0;
  height: 50px;
  width: 50px;
  background-color: #007bff;
  border-radius: 50%;
  cursor: pointer;
  transition: left 0.1s;
}

#rideStartedSlider {
  .slideunlock {
    background-color: red;
    --su-color-bg: red;
  }
}
</style>
