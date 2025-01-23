<template>
  <div v-if="(isDriverValid) || initialLoadCompleted" class="row location-selector-container">
    <header class="col-xs-12 header-container">
      <img class="rickshaw" :src="images.autoRickShaw" alt="Rickshaw" width="70px" />
      <img class="urban-loop-logo" :src="images.logo" alt="Urban Loop Logo" width="80%" />
    </header>

    <section class="col-xs-12 map-container">
      <map-box
        :source-cordinates="sourceCordinates"
        :destination-cordinates="destinationCordinates"
        :place-current-location="placeCurrentLocation"
        :place-destination-location="placeDestinationLocation"
      />
      <font-awesome-icon
        icon="location"
        class="location-icon"
        title="Current Location"
        @click="setCurrentLocation"
      />
    </section>

    <section class="col-xs-12 form-group">
      <div v-if="isSourceLoading" class="spinner-container">
        <div class="spinner-border"></div>
      </div>
      <font-awesome-icon icon="search" class="search-icon" />
      <input
        v-model="source"
        class="form-control"
        :class="sourcePlaces?.length ? 'remove-border' : ''"
        type="text"
        placeholder="Search Source Location"
        @input="debouncedSearchSourceLocation()"
      />
      <ul v-if="sourcePlaces?.length" class="place-list-container">
        <li
          v-for="place in sourcePlaces"
          :key="place.id"
          :title="place.name_place"
          @click="selectPlace(EPathConfig.SOURCE, place)"
        >
          {{ place.name_place }}
        </li>
      </ul>
    </section>

    <section class="col-xs-12 form-group">
      <div v-if="isDestinationLoading" class="spinner-container">
        <div class="spinner-border"></div>
      </div>
      <font-awesome-icon icon="search" class="search-icon" />
      <input
        v-model="destination"
        class="form-control"
        :class="destinationPlaces?.length ? 'remove-border' : ''"
        type="text"
        placeholder="Search Destination"
        @input="debouncedSearchDestinationLocation()"
      />
      <ul v-if="destinationPlaces?.length" class="place-list-container">
        <li
          v-for="place in destinationPlaces"
          :key="place.id"
          :title="place.name_place"
          @click="selectPlace(EPathConfig.DESTINATION, place)"
        >
          {{ place.name_place }}
        </li>
      </ul>
    </section>

    <section class="col-xs-12 form-group text-start fw-bold mt-1">
      <label for="mobileNumber">Mobile Number:</label>
      <div class="input-group">
        <label class="input-group-text" for="mobileNumber">+91</label>
        <input
          id="mobileNumber"
          v-model="mobileNumber"
          class="form-control ps-3"
          type="number"
          placeholder="Enter Mobile Number"
          @input="debouncedValidateMobileNumber"
        />
      </div>
      <div v-if="mobileNumberError" class="mobile-number-error-message">
        {{ mobileNumberError }}
      </div>
    </section>

    <section class="col-xs-12 form-group">
      <button class="confirm-button" :class="(!source || !destination || !mobileNumber || mobileNumberError) ? 'disabled' : ''" @click="handleOTPAndFairService">Confirm</button>
    </section>
  </div>
  <div v-if="!isLoading && !isDriverValid" class="driver-not-found">
    <h3>Driver not found!</h3>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import MapBox from '../../Widgets/Mapbox.vue';
import Loader from '../../Widgets/Loader.vue';
import { images } from '../../../assets/images';
import MapService from '../../../services/map';
import { generateSessionId } from '../../../utils/helper';
import { EPathConfig } from '../../../utils/constant';
import OtpService from '../../../services/otp.service';
import FairService from '../../../services/fair.service';
import { mapActions, mapGetters } from 'vuex';
import DriverService from '../../../services/driver.service';
import { toast } from '@steveyuowo/vue-hot-toast';

const mapService = new MapService();
const otpService = new OtpService();
const fairService = new FairService();
const driverService = new DriverService();

export default {
  name: 'LocationSelector',
  components: { MapBox, Loader },
  data() {
    return {
      source: '',
      destination: '',
      sourcePlaces: [],
      destinationPlaces: [],
      sourceCordinates: [],
      destinationCordinates: [],
      mobileNumber: '',
      mobileNumberError: '',
      placeCurrentLocation: false,
      placeDestinationLocation: false,
      debouncedSearchSourceLocation: debounce(this.searchSourceLocation, 100),
      debouncedSearchDestinationLocation: debounce(this.searchDestinationLocation, 100),
      debouncedValidateMobileNumber: debounce(this.validateMobileNumber, 500),
      images,
      EPathConfig,
      isSourceLoading: false,
      isDestinationLoading: false,
      isDriverValid: false,
      initialLoadCompleted: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'getLoading',
    }),
  },
  mounted() {
    this.isValidDriver(this.$route?.query?.driver_id);
  },
  methods: {
    ...mapActions([
      'setFairDetails',
      'setMobileNumber',
      'setSourceDetails',
      'setDestinationDetails',
      'setDriverId',
      'setIsLoading',
      'setLoadingMessage'
    ]),
    async isValidDriver(driverId) {
      try {
        this.initialLoadCompleted = true;
        this.setIsLoading(true);
        this.setLoadingMessage('Please wait while we verify the driver...');
        // this.loadingMessage = ;
        const driverResponse = await driverService.isValidDriver(driverId);
        this.isDriverValid = driverResponse?.data?.exists;
        this.setDriverId(this.$route?.query?.driver_id);
      } catch (error) {
        toast.error('Unable to verify the driver details. Please try again')
      } finally {
        this.setIsLoading(false);
        this.setLoadingMessage();
        this.initialLoadCompleted = false;
      }
    },
    async searchSourceLocation() {
      this.isSourceLoading = true;
      try {
        const { latitude, longitude } = await this.fetchCurrentLocation();
        const payload = {
          query: this.source,
          proximity_latitude: latitude,
          proximity_longitude: longitude,
          session_token: generateSessionId(),
        };
        const response = await mapService.getNearLocations(payload);
        this.sourcePlaces = response?.data || [];
      } catch (error) {
        toast.error('Failed to fetch source location. Please try again');
      } finally {
        this.isSourceLoading = false;
      }
    },
    async searchDestinationLocation() {
      this.isDestinationLoading = true;
      try {
        const { latitude, longitude } = await this.fetchCurrentLocation();
        const payload = {
          query: this.destination,
          proximity_latitude: latitude,
          proximity_longitude: longitude,
          session_token: generateSessionId(),
        };
        const response = await mapService.getNearLocations(payload);
        this.destinationPlaces = response?.data || [];
      } catch (error) {
        toast.error('Failed to fetch destination location. Please try again');
      } finally {
        this.isDestinationLoading = false;
      }
    },
    async selectPlace(type, place) {
      try {
        const payload = {
          location_id: place.mapbox_id,
          session_id: generateSessionId(),
        };
        const { data } = await mapService.getLocationDetails(payload);
        if (type === EPathConfig.SOURCE) {
          this.sourceCordinates = [data.longitude, data.latitude];
          this.source = place.name_place;
          this.sourcePlaces = [];
          this.resetPlaceFlag('placeCurrentLocation');
        } else if (type === EPathConfig.DESTINATION) {
          this.destinationCordinates = [data.longitude, data.latitude];
          this.destination = place.name_place;
          this.destinationPlaces = [];
          this.resetPlaceFlag('placeDestinationLocation');
        }
      } catch (error) {
        toast.error('Failed to get location details');
      }
    },
    resetPlaceFlag(flag) {
      this[flag] = true;
      setTimeout(() => {
        this[flag] = false;
      }, 2000);
    },
    async setCurrentLocation() {
      this.isSourceLoading = true;
      const { latitude, longitude } = await this.fetchCurrentLocation();
      try {
        const locationResponse = await mapService.getLocationName(longitude, latitude);
        this.sourceCordinates = [longitude, latitude];
        this.source = locationResponse?.data?.Name || 'Current Location (You)';
        this.sourcePlaces = [];
        this.resetPlaceFlag('placeCurrentLocation');
      } catch (error) {
        toast.error('Failed to fetch current location name. Please try again');
      } finally {
        this.isSourceLoading = false;
      }
    },
    fetchCurrentLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              return resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              toast.error(error.message || 'Failed to fetch location.');
              return reject(error.message || 'Failed to fetch location.')
            }
          );
        } else {
          toast.error('Geolocation is not supported by this browser.');
          return reject('Geolocation is not supported by this browser.');
        }
      });
    },
    validateMobileNumber() {
      const indianMobilePattern = /^[6-9]\d{9}$/;
      this.mobileNumberError = indianMobilePattern.test(this.mobileNumber)
        ? ''
        : 'Invalid mobile number';
    },
    async handleOTPAndFairService() {
      if (this.source && this.destination && this.mobileNumber && !this.mobileNumberError) {
        try {
          this.setIsLoading(true);
          this.setLoadingMessage('Sending OTP and fetching fare details...');
          // Define the payload for the fair service
          const fairPayload = {
            origin_lat: this.sourceCordinates[1],
            origin_lon: this.sourceCordinates[0],
            dest_lat: this.destinationCordinates[1],
            dest_lon: this.destinationCordinates[0]
          };
  
          const [otpResponse, autoFairResponse] = await Promise.all([
            otpService.sendOtp(this.mobileNumber), // OTP service call
            fairService.getAutoFare(fairPayload)  // Fair service call
          ]);
  
          // Handle OTP response
          if (otpResponse && autoFairResponse) {
            this.setIsLoading(false);
            this.setLoadingMessage('');
            this.setFairDetails({ ...autoFairResponse.data });
            this.setSourceDetails({
              latitude: this.sourceCordinates[1],
              longitude: this.sourceCordinates[0],
              address: this.source,
            });
            this.setDestinationDetails({
              latitude: this.destinationCordinates[1],
              longitude: this.destinationCordinates[0],
              address: this.destination,
            });
            this.setMobileNumber(this.mobileNumber);
            this.$router.push({ name: 'UserFairDetails' });
          }
  
        } catch (error) {
          this.setIsLoading(false);
          this.setLoadingMessage('');
          toast.error('Unable to fetch details or send OTP. Please try again.');
        }
      }
    }
  },
};
</script>

<style lang="scss">
.location-selector-container {
  .header-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .rickshaw {
      width: 70px;
    }

    .urban-loop-logo {
      width: 80%;
      margin-left: -12px;
    }
  }

  .map-container {
    position: relative;

    .location-icon {
      position: absolute;
      bottom: 40px;
      right: 30px;
      background: white;
      color: gray;
      padding: 8px;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .form-group {
    position: relative;

    .spinner-container {
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 13px;
      color: gray;

      .spinner-border {
        width: 1.3rem;
        height: 1.3rem;
      }
    }

    .indian-code {
      position: absolute;
    }

    .search-icon {
      position: absolute;
      top: 18px;
      left: 20px;
      color: rgba(0, 0, 0, 0.8);
    }

    .remove-border {
      border-bottom: 0;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    input.form-control[type="text"] {
      border-radius: 5px;
      border: 2.5px solid rgba(0, 0, 0, 0.8);
      padding-left: 30px;
      margin: 5px 0;

      &::placeholder {
        color: rgba(0, 0, 0, 0.8);
      }

      &:focus {
        box-shadow: none;
      }
    }

    .input-group-text {
      padding: 10px;
      font-size: 14px;
      height: 41px;
      margin-top: 5px;
      border-radius: 0;
      border: 2.5px solid rgba(0, 0, 0, 0.8);
      border-right: 0px;
      font-weight: 500;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }

    input[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
      border: 2.5px solid rgba(0, 0, 0, 0.8);
      padding-left: 10px !important;
      margin: 5px 0;

      &::placeholder {
        color: rgba(0, 0, 0, 0.8);
      }

      &:focus {
        box-shadow: none;
      }

      &::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    .place-list-container {
      position: absolute;
      background: white;
      border: 2px solid #ccc;
      list-style: none;
      margin: 0;
      padding: 0;
      z-index: 1;
      top: 44px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      width: 91%;
      border: 3px solid black;
      margin-top: -2px;
      max-height: 175px;
      overflow-y: auto;
      text-align: start;

      li {
        padding: 5px 10px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          background-color: rgb(218, 218, 218);
          cursor: pointer;
        }
      }
    }

    .mobile-number-error-message {
      color: #dc3545;
      font-size: 14px;
      font-weight: 500;
    }

    .confirm-button {
      background-color: #2d9bf0;
      color: white;
      width: 100%;
      margin-top: 10px;
      border-radius: 5px;
    }

    .confirm-button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.driver-not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
