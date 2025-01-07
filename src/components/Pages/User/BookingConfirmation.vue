<template>
  <div class="row booking-confirmed-container">
    <div class="col-xs-12 header-container">
      <h2>YOU ARE ON <span>FLASH RIDE</span></h2>
    </div>
    <div class="col-xs-12 map-box-container">
      <booking-map
      v-if="initializeMap"
      :source-details="sourceCoordinates"
      :destination-details="destinationCoordinates" />
      <div class="google-map-icon">
        <h2>Tap here for directions</h2>
        <img :src="images.chevronDoubleRightIcon" alt="google-map-icon" width="40px" @click="navigateToGoogleMap" />
        <img :src="images.googleMapIcon" class="google-map-image" title="Tap here for directions" alt="google-map-icon" width="50px" @click="navigateToGoogleMap" />
      </div>
      <!-- <img :src="images.googleMapIcon" alt="google-map-icon" class="google-map-icon" width="60px" @click="navigateToGoogleMap" /> -->
    </div>
    <div class="col-xs-12 estimates-travel text-center">
      <div>Estimates Travel time <span class="text-success">{{ Math.round(fairDetails?.duration_minutes) }} Mins</span></div>
    </div>
    <div class="col-xs-12 mt-4 driver-info">
      <div class="row p-0">
        <div class="col-xs-6 col-sm-6 d-flex align-items-center p-0 auto-model-details">
          <font-awesome-icon icon="circle-user" class="user-icon" />
          <div class="ms-2">
            <span class="d-block fw-bold">Driver Name</span>
            <span class="d-block">{{ userRideInfo?.driver_name || 'Rajesh Singh' }}</span>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 auto-model-details p-0">
          <img :src="images.autoRickShaw" alt="autorickshaw" class="rickshaw" />
          <div>
            <span class="d-block fw-bold">Vehicle No</span>
            <span class="d-block">{{ userRideInfo?.velc_no }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 mt-1 p-0 heading-info">
      <div class="row p-0 text-start d-flex align-items-start" style="font-size: 14px;">
        <div class="col-xs-5 col-sm-5 p-0 fw-bold text-center">Heading Towards:</div>
        <div class="col-xs-7 col-sm-7" style="font-size: 13px;">{{ userRideInfo?.dest_address}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { images } from '../../../assets/images';
import BookingMap from '../../Widgets/BookingMap.vue';
import Mapbox from '../../Widgets/Mapbox.vue';
import UserService from '../../../services/user.service';
import { toast } from '@steveyuowo/vue-hot-toast';

const userService = new UserService();

export default {
  name: 'BookingConfirmation',
  components: {
    Mapbox,
    BookingMap
  },
  data() {
    return {
      placeCurrentLocation: false,
      placeDestinationLocation: false,
      sourceCordinates: [],
      destinationCordinates: [],
      images,
      initializeMap: false,
    };
  },
  computed: {
    ...mapGetters({
      sourceDetails: 'getSourceDetails',
      destinationDetails: 'getDestinationDetails',
      fairDetails: 'getFairDetails',
      userRideInfo: 'getUserRideInfo',
      mobileNumber: 'getMobileNumber',
    }),
  },
  mounted() {
    this.initializeMap = false;
    this.sourceCoordinates = [this.sourceDetails.longitude, this.sourceDetails.latitude];
    this.destinationCoordinates = [this.destinationDetails.longitude, this.destinationDetails.latitude];
    this.initializeMap = true;
    this.rideStatus();
  },
  methods: {
    ...mapActions([
      'setUserRideInfo',
    ]),
    navigateToGoogleMap() {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${this.userRideInfo?.dest_latitude},${this.userRideInfo?.dest_longitude}`, '__blank')
    },
    async rideStatus() {
      try {
        const rideResponse = await userService.rideStatus(this.mobileNumber);
        if (rideResponse?.data.ride_status === 'completed') {
          this.setUserRideInfo({});
          this.$router.push({ name: 'UserRideCompletion' });
        } else {
          this.rideStatus();
        }
      } catch (error) {
        toast.error('Failed to fetch ride status. Please try again.')
      } 
    }
  }
};
</script>

<style lang="scss">
.booking-confirmed-container {
  margin-top: 30px;
  font-family: Arial, Helvetica, sans-serif;

  .header-container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    h2 {
      font-family: 'Bangers', cursive;
      font-size: 20px;
      margin: 0;

      span {
        font-size: 35px;
        color: #2d9bf0;
      }
    }
  }

  .map-box-container {
    position: relative;
    width: 100%;
    height: 250px;
    border: 2px solid #ccc;
    border-radius: 5px;
    padding: 0 !important;

    .google-map-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      position: absolute;
      bottom: 0;
      right: 0;

      h2 {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 0px;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif ;
      }

      .google-map-image {
        cursor: pointer;
        border: 2px solid green;
        border-radius: 5px;
        width: 60px;
      }
    }
  }

  .estimates-travel {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    div {
      width: 70%;
      font-size: 17px;
      font-weight: 600;
    }
  }

  .driver-info {
    margin-top: 20px;

    .user-icon {
      color: #2d9bf0;
      font-size: 35px;
    }

    .driver-details {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      font-size: 12px;

      label {
        font-weight: 500;

        span {
          font-weight: 400;
        }
      }
    }

    .auto-model-details {
      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: center;
      font-size: 12px;
      margin-bottom: 15px;

      .rickshaw {
        width: 50px;
        height: 30px;
        margin: 0 auto;
      }

      div {
        margin-top: 5px;
      }
    }
  }

  .heading-info {
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    margin-left: 15px;
    margin-top: 20px;
  }
}
</style>
