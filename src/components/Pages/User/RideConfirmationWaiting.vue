<template>
  <div class="row driver-confirmation-waiting-container">
    <div class="col-xs-12 header-container text-center">
      <img :src="images.autoRickShaw" alt="autoRickshaw" class="rickshaw" />
      <h2>Getting Your <span>FLASH RIDE</span></h2>
    </div>
    <div class="col-xs-12 waiting-driver-content">
      <div class="estimated-fair">
        <vertical-step-progress :steps="finalSteps" :current-step="currentStep" />
        <button class="btn btn-primary mt-2 m-auto" :class="isRefreshed ? 'rotate' : ''" title="Refresh Ride Status" @click="handleRefreshButton()">
          <font-awesome-icon icon="rotate-right" />
          Refresh
        </button>
        <!-- <span v-if="isLoading">Checking Driver Availability....</span>
        <span v-else-if="!isDriverAviable && isDriverVerfied">Driver is on other Ride</span>
        <span v-else-if="isDriverAviable && !isDriverVerfied">Driver is not verified</span>
        <span v-else-if="!isDriverAviable && !isDriverVerfied">Driver not found</span>
        <div v-else-if="isDriverAccepted" class="driver-acceptance-message">
          <span>Ride Accepted. Waiting to start the ride</span>
          <button class="btn btn-primary mt-2 m-auto" :class="isRefreshed ? 'rotate' : ''" title="Refresh Ride Status" @click="handleRefreshButton()">
            <font-awesome-icon icon="rotate-right" />
            Refresh
          </button>
        </div>
        <div v-else class="driver-acceptance-message">
          <span>Waiting for Driver's Confirmation</span>
          <button class="btn btn-primary mt-2 m-auto" :class="isRefreshed ? 'rotate' : ''" title="Refresh Ride Status" @click="handleRefreshButton()">
            <font-awesome-icon icon="rotate-right" />
            Refresh
          </button> -->
          <!-- <font-awesome-icon icon="rotate-right" :class="isRefreshed ? 'rotate' : ''" title="Refresh Ride Status" @click="handleRefreshButton()" /> -->
        <!-- </div> -->
      </div>
    </div>
    <div class="col-xs-12 form-group">
      <!-- <button  v-if="!isLoading && isDriverAviable && isDriverVerfied" class="cancel-request-btn">Cancel Request</button> -->
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
import VerticalStepProgress from '../../Widgets/VerticalStepProgress.vue';

const driverService = new DriverService();
const userService = new UserService();

export default {
  name: 'RideConfirmationWaiting',
  components: {
    VerticalStepProgress,
  },
  data() {
    return {
      isLoading: false,
      isDriverAviable: false,
      isDriverVerfied: false,
      isDriverAccepted: false,
      images,
      isRefreshed: false,
      currentStep: 1,
      finalSteps: [],
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
    steps() {
      const steps = [
        { title: "Checking Driver Availability", isCompleted: false },
      ];
      if (!this.isDriverAviable && this.isDriverVerfied) {
        steps.push({ title: 'Driver is on other Ride' });
      } else if (this.isDriverAviable && !this.isDriverVerfied) {
        steps.push({ title: 'Driver is not verified' });
      } else if (!this.isLoading && !this.isDriverAviable && !this.isDriverVerfied) {
        steps.push({ title: 'Driver not found' });
      } else {
        console.log(this.isLoading, this.isDriverAccepted)
        steps.push({ title: "Waiting for Driver's Confirmation", isPending: false, isCompleted: false }),
        steps.push({ title: "Ride Accepted. Waiting to start the ride", isPending: false, isCompleted: false });
      }
      return steps;
    }
  },
  mounted() {
    this.checkDriverAvialabilty();
  },
  methods: {
    ...mapActions([
      'setUserRideInfo',
      'setIsLoading',
      'setLoadingMessage',
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
        toast.error('Failed to verified the driver. Please try again');
      } finally {
        this.isLoading = false;
        const steps = this.steps;
        steps[0].isCompleted = true;
        this.currentStep = 2;
        this.finalSteps = [...steps];
        
        setTimeout(() => {
          const waitingSteps = this.steps;
          if (!this.isDriverAviable && this.isDriverVerfied) {
            waitingSteps[1].isPending = true;
          } else if (this.isDriverAviable && !this.isDriverVerfied) {
            waitingSteps[1].isWarning = true;
          } else if (!this.isDriverAviable && !this.isDriverVerfied) {
            waitingSteps[1].isDanger = true;
          } else {
            waitingSteps[1].isPending = true;
          }
          this.finalSteps = [...waitingSteps];
        }, 2000)

        console.log(this.finalSteps)
      }
    },
    async createRide() {
      try {
        // this.setIsLoading(true);
        // this.setLoadingMessage('Creating the Ride. Please wait...');
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
          user_mobile: this.mobileNumber,
        };
        const rideResponse = await driverService.createRide(payload);
        if (rideResponse?.data?.message === 'Success') {
          this.rideStatus();
        }
      } catch (error) {
        toast.error('Failed to create ride. Please try again'); 
      } finally {
        this.setIsLoading(false);
        this.setLoadingMessage('');
      }
    },
    async rideStatus() {
      try {
        // this.setIsLoading(true);
        // this.setLoadingMessage('Checking your ride status. Please wait...');
        const rideResponse = await userService.rideStatus(this.mobileNumber);
        if (rideResponse?.data.ride_status === 'started') {
          this.isDriverAccepted = false;
          this.setUserRideInfo(rideResponse?.data);
          const steps = this.steps;
          steps[0].isCompleted = true;
            steps[0].isPending = false;
            steps[1].isCompleted = true;
            steps[1].isPending = false;
            steps[2].isCompleted = true;
            steps[2].isPending = false;
            this.currentStep = 4;
            this.finalSteps = [...steps];
            setTimeout(() => {
              this.$router.push({ name: 'UserBookingConfirmation' });
            }, 2000)
        } else {
          if (rideResponse?.data.ride_status === 'accepted') {
            this.isDriverAccepted = true;
            const steps = this.steps;
            steps[0].isCompleted = true;
            steps[0].isPending = false;
            steps[1].isCompleted = true;
            steps[1].isPending = false;
            this.currentStep = 3;
            this.finalSteps = [...steps];

            setTimeout(() => {
              const waitingSteps = this.steps;
              waitingSteps[2].isPending = true;
              this.finalSteps = [...waitingSteps];
            }, 2000)
          }
          // this.rideStatus();
        }
      } catch (error) {
        toast.error('Failed to fetch ride details'); 
      } finally {
        this.setIsLoading(false);
        this.isRefreshed = false;
        this.setLoadingMessage('');
      }
    },
    handleRefreshButton() {
      this.isRefreshed = true;
      this.rideStatus();
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
    margin-top: 40px;

    .estimated-fair {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      font-family: Arial, Helvetica, sans-serif;

      .driver-acceptance-message {
        display: flex;
        flex-direction: column;


        .fa-rotate-right {
          cursor: pointer;
          transition: transform 0.5s ease-in;
        }

        .rotate .fa-rotate-right {
          animation: rotate-animation 0.5s linear infinite;
        }
      }

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

@keyframes rotate-animation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
