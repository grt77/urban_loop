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
      <img :src="images.googleMapIcon" alt="google-map-icon" class="google-map-icon" width="60px" @click="navigateToGoogleMap" />
    </div>
    <div class="col-xs-12 estimates-travel">
      <div>Estimates Travel time {{ fairDetails?.duration_minutes }} Mins</div>
    </div>
    <div class="col-xs-12 mt-4 driver-info">
      <div class="row">
        <div class="col-xs-6 col-sm-6 d-flex align-items-center p-0">
          <font-awesome-icon icon="circle-user" class="user-icon" />
          <div class="driver-details">
            <label for="driver-name"><span>{{ userRideInfo?.mobile_no }}</span></label>
            <span>{{ userRideInfo?.velc_no }}</span>
          </div>
        </div>
        <div class="col-xs-6 col-sm-6 auto-model-details p-0">
          <img :src="images.autoRickShaw" alt="autorickshaw" class="rickshaw" />
          <div>
            <span class="fw-bold">Auto Model</span> - Mahindra
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 mt-4 heading-towards">
      <span class="fw-bold">Heading Towards:&nbsp;&nbsp;</span> {{ userRideInfo?.dest_address?.split(',')[0] }}
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
  margin-top: 50px;
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
      position: absolute;
      bottom: 0;
      right: 0;
      cursor: pointer;
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
      flex-direction: column;
      justify-content: center;
      text-align: center;
      font-size: 12px;
      margin-bottom: 15px;

      .rickshaw {
        width: 50px;
        margin: 0 auto;
      }

      div {
        margin-top: 5px;
      }
    }
  }

  .heading-towards {
    font-size: 14px;
    margin-top: 20px;

    span {
      font-weight: bold;
    }
  }
}
</style>
