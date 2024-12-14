<template>
  <div class="row driver-confirmation-waiting-container">
    <div class="col-xs-12 header-container">
      <img :src="images.autoRickShaw" alt="autoRickshaw" class="rickshaw" />
      <h2>Getting Your <span>FLASH RIDE</span></h2>
    </div>
    <div class="col-xs-12 waiting-driver-content">
      <div class="estimated-fair">
        <span v-if="isLoading">Checking Driver Avialabilty....</span>
        <span v-else-if="!isDriverAviable && isDriverVerfied">Driver is on other Ride</span>
        <span v-else-if="isDriverAviable && !isDriverVerfied">Driver is not verified</span>
        <span v-else-if="!isDriverAviable && !isDriverVerfied">Driver not found</span>
        <span v-else>Waiting for Driver's Confirmation</span>
      </div>
    </div>
    <div class="col-xs-12 form-group">
      <button  v-if="!isLoading && isDriverAviable && isDriverVerfied" class="cancel-request-btn">Cancel Request</button>
    </div>
    <div class="col-xs-12">
      <img :src="images.logo" alt="urban-loop-logo" class="urban-loop-logo" />
    </div>
  </div>
</template>

<script>
import { images } from '../../../assets/images';
import DriverService from '../../../services/driver.service';
import { mapActions, mapGetters } from 'vuex';
import UserService from '../../../services/user.service';

const driverService = new DriverService();
const userService = new UserService();

export default {
  name: 'RideConfirmationWaiting',
  data() {
    return {
      isLoading: false,
      isDriverAviable: false,
      isDriverVerfied: false,
      images,
    };
  },
  computed: {
    ...mapGetters({
      driverId: 'getDriverId',
      sourceDetails: 'getSourceDetails',
      destinationDetails: 'getDestinationDetails',
      userId: 'getUserId',
      fairDetails: 'getFairDetails',
      mobileNumber: 'getMobileNumber',
    }),
  },
  mounted() {
    this.checkDriverAvialabilty();
  },
  methods: {
    ...mapActions([
      'setUserRideInfo',
    ]),
    async checkDriverAvialabilty() {
      try {
        this.isLoading = true;
        const driverResponse = await driverService.getDriverVerifiedDetails(this.driverId);
        this.isDriverAviable = !!driverResponse?.data?.is_available;
        this.isDriverVerfied = !!driverResponse?.data?.verified;
        if (this.isDriverAviable && this.isDriverVerfied) {
          this.createRide();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    async createRide() {
      try {
        const payload = {
          driver_id: this.driverId,
          origin_lat: this.sourceDetails?.latitude,
          origin_lon: this.sourceDetails?.longitude,
          origin_addr: this.sourceDetails?.address,
          dest_lat: this.destinationDetails?.latitude,
          dest_lon: this.destinationDetails?.longitude,
          dest_addr: this.destinationDetails?.address,
          price: this.fairDetails?.fare_amount,
          user_id: this.userId,
          ride_status: 'requested',
        };
        const rideResponse = await driverService.createRide(payload);
        if (rideResponse?.data?.message === 'Success') {
          this.rideStatus();
        }
      } catch (error) {
        console.log(error); 
      } 
    },
    async rideStatus() {
      try {
        const rideResponse = await userService.rideStatus(this.mobileNumber);
        if (rideResponse?.data.ride_status === 'started') {
          this.setUserRideInfo(rideResponse?.data);
          this.$router.push({ name: 'UserBookingConfirmation' });
        } else {
          this.rideStatus();
        }
      } catch (error) {
        console.log(error); 
      } 
    }
  }
};
</script>

<style lang="scss">
.driver-confirmation-waiting-container {
  margin-top: 50px;

  .header-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0;

    .rickshaw {
      width: 70px;
      z-index: 1;
      margin-bottom: 30px;
    }

    h2 {
      font-family: 'Bangers';
      margin-bottom: 0;
      font-size: 20px;
      width: 50%;

      span {
        font-size: 35px;
      }
    }
  }

  .waiting-driver-content {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 80px;

    .estimated-fair {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      font-family: Arial, Helvetica, sans-serif;
    }
  }

  .form-group {
    .urban-loop-logo {
      width: 100%;
    }

    .cancel-request-btn {
      width: 100%;
      background-color: #2D9BF0;
      color: white;
      margin-top: 10px;
      border-radius: 5px;
    }
  }

  .urban-loop-logo {
    margin-top: 80px;
    width: 100%;
  }
}
</style>
