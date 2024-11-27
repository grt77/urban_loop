<template>
  <div class="row source-destination-container">
    <div class="col-xs-12 map-container">
      <map-box
        :source-cordinates="sourceCordinates"
        :destination-cordinates="destinationCordinates"
        :place-current-location="placeCurrentLocation"
        :place-destination-location="placeDestinationLocation"
      />
      <font-awesome-icon icon="location" class="location-icon" title="Current Location" @click="selectCurrentLocation" />
    </div>
    <div class="col-xs-12 form-group">
      <font-awesome-icon icon="search" class="search-icon" />
      <input v-model="source" class="form-control" type="text" placeholder="Search Source Location" @change="debouncedSearchLocation('source')" />
      <ul v-if="this.sourcePlaces?.length" class="place-list-container">
        <li v-for="(place) in this.sourcePlaces" :key="place?.id" @click="selectPlace('source', place)">{{ place?.place_name }}</li>
      </ul>
    </div>
    <div class="col-xs-12 form-group">
      <font-awesome-icon icon="search" class="search-icon" />
      <input v-model="destination" class="form-control" type="text" placeholder="Search Destination" @change="debouncedSearchLocation('destination')" />
      <ul v-if="this.destinationPlaces?.length" class="place-list-container">
        <li v-for="(place) in this.destinationPlaces" :key="place?.id" @click="selectPlace('destination', place)">{{ place?.place_name }}</li>
      </ul>
    </div>
    <div class="col-xs-12 form-group">
      <input class="form-control" type="number" placeholder="Enter Mobile Number" />
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash';
import MapBox from '../Widgets/Mapbox.vue';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default {
  name: 'SourceDestinationPicker',
  components: { MapBox },
  data() {
    return {
      source: '',
      destination: '',
      placeCurrentLocation: false,
      placeDestinationLocation: false,
      sourcePlaces: [],
      destinationPlaces: [],
      sourceCordinates: [],
      destinationCordinates: [],
      debouncedSearchLocation: debounce(this.searchLocation, 500),
    }
  },
  methods: {
    async searchLocation(type) {
      console.log(type)
      if (this.source.length < 3) {
        if (type === 'source') {
          this.sourcePlaces = [];
        } else {
          this.destinationPlaces = [];
        }
        return; // Only search if the query length is more than 3 characters
      }

      try {
        // Construct the Geocoding API URL
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(type === 'source' ? this.source : this.destination)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`;

        const response = await fetch(geocodeUrl);
        const data = await response.json();

        // Update places array with search results
        if (type === 'source') {
          this.sourcePlaces = data.features || [];
        } else {
          this.destinationPlaces = data.features || [];
        }
        console.log(this.sourcePlaces, data.features);
      } catch (error) {
        console.error('Error searching for location:', error);
      }
    },
    selectPlace(type, place) {
      if (type === 'source') {
        this.sourceCordinates = place?.center || '';
        this.source = place?.place_name || '';
        this.placeCurrentLocation =  true;
        setTimeout(() => {
          this.placeCurrentLocation = false;
        }, 2000)
        this.sourcePlaces = [];
      } else {
        this.destinationCordinates = place?.center || '';
        this.destination = place?.place_name || '';
        this.destinationPlaces = [];
        this.placeDestinationLocation =  true;
        setTimeout(() => {
          this.placeDestinationLocation = false;
        }, 2000)
      }
    },
    selectCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            this.sourceCordinates = [longitude, latitude];
            console.log(this.sourceCordinates)
            this.placeCurrentLocation =  true;
            this.source = 'Current Location';
            setTimeout(() => {
              this.placeCurrentLocation = false;
            }, 2000);
          });
      }
    }
  }
};
</script>
<style lang="scss">
.source-destination-container {

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

    .search-icon {
      position: absolute;
      left: 20px;
      top: 18px;
      color: rgba(0, 0, 0, 0.8);
    }

    .form-control[type="text"] {
      border-radius: 0px;
      margin: 5px 0px;
      border: 2px solid rgba(0, 0, 0, 0.8);
      padding-left: 28px;
  
      &::placeholder {
        color: rgba(0, 0, 0, 0.8);
      }
    }

    .form-control[type="number"] {
      border-radius: 0px;
      margin: 5px 0px;
      border: 2px solid rgba(0, 0, 0, 0.8);
  
      &::placeholder {
        color: rgba(0, 0, 0, 0.8);
      }
    }

    .place-list-container {
      position: absolute;
      background: white;
      border: 2px solid;
      padding: 0;
      list-style: none;
      text-align: start;
      z-index: 1;
      margin: 0;
      top: 44px;
      margin-right: 12px;

      li {
        padding: 0 10px;
        &:hover {
          background-color: rgb(218, 218, 218);
          cursor: pointer;
        }
      }
    }
  }
}
</style>