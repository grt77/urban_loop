<template>
  <div>
    <div id="bookingConfiremd" ref="mapContainer" class="map-container" :style="`height: ${height};`"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import { images } from '../../assets/images';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default {
  props: {
    sourceDetails: {
      type: Array,
      default: () => [],
    },
    destinationDetails: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: '245px',
    },
    isRideStarted: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      map: null,
      sourceCoordinates: [-73.9857, 40.7484], // Example default coordinates
      destinationCoordinates: [-74.0445, 40.6892], // Example default coordinates
      autoMarker: null,
      route: [],
      moveInterval: null,
      stepIndex: 0,
      images,
      userMarker: null,
    };
  },
  watch: {
    isRideStarted: {
      handler(val) {
        if (val) {
          this.startRide();
        }
      }
    },
  },
  mounted() {
    this.initializeCoordinates();
    this.initializeMap();
  },
  beforeDestroy() {
    if (this.moveInterval) clearInterval(this.moveInterval);
    if (this.map) this.map.remove();
  },
  methods: {
    initializeCoordinates() {
      if (this.sourceDetails) {
        this.sourceCoordinates = this.sourceDetails;
      }
      if (this.destinationDetails) {
        this.destinationCoordinates = this.destinationDetails;
      }
    },
    initializeMap() {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

      this.map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: this.sourceCoordinates,
        zoom: 14,
        attributionControl: false,
      });


      this.map.on('load', () => {
        this.getRoute();
        
        this.setupLocationTracking();
      });
    },
    async getRoute() {
      const start = this.sourceCoordinates;
      const end = this.destinationCoordinates;
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&overview=full&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: 'GET' }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };


      this.addRouteToMap(geojson);

      this.addMarkers();

      this.route = geojson?.geometry?.coordinates || []


      const bounds = new mapboxgl.LngLatBounds();
      route.forEach(coord => bounds.extend(coord));

      // Fit the map to the bounds
      this.map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 14,
      });

      var el = document.createElement('div');
      el.className = 'marker';

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(this.sourceCoordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }))
        .addTo(this.map);

    },

    addRouteToMap(routeGeojson) {
    // Remove previous routes if any
      if (this.map.getSource('route')) {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      }

      this.map.addSource('route', {
        type: 'geojson',
        data: routeGeojson,
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 4,
        },
      });
    },
    addMarkers() {
      new mapboxgl.Marker()
        .setLngLat(this.sourceCoordinates)
        .addTo(this.map);
        
      new mapboxgl.Marker({ color: 'red' }) // Set the color
        .setLngLat(this.destinationCoordinates)
        .addTo(this.map);
    },
    updateUserLocation(position) {
      if (this.isMoving) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newLocation = [lng, lat];

        // Update the user marker's position
        if (this.userMarker) {
          this.userMarker.setLngLat(newLocation);
          this.setBoundsToStart([lat, lng])
        }
      }
    },
    addUserMarker() {
      const customMarkerElement = document.createElement('div');
      customMarkerElement.style.backgroundImage = `url(${this.images.navigationImage})`;
      customMarkerElement.style.width = `25px`;
      customMarkerElement.style.height = `25px`;
      customMarkerElement.style.backgroundSize = '100%';
      customMarkerElement.style.cursor = 'pointer';
      this.userMarker = new mapboxgl.Marker({ element: customMarkerElement })
        .setLngLat(this.sourceCoordinates)
        .addTo(this.map);
        this.setBoundsToStart(this.sourceCoordinates);
    },
    startRide() {
      this.addUserMarker();
    },
    setupLocationTracking() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.updateUserLocation(position);
            this.setupLocationTracking();
          },
          (error) => console.error(error),
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    },
    setBoundsToStart(coordinates) {
      const startCoordinates = coordinates // Example start coordinates (Longitude, Latitude)
      
      // Create a new bounds object
      const bounds = new mapboxgl.LngLatBounds();
      
      // Extend the bounds to include the start coordinates
      bounds.extend(startCoordinates);
      
      // Fit the map to the bounds
      this.map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 }, // Optional padding
        maxZoom: 20, // Optional max zoom
      });
    },
    fetchCurrentLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => reject(error.message || 'Failed to fetch location.')
          );
        } else {
          reject('Geolocation is not supported by this browser.');
        }
      });
    },
  },
};
</script>

<style lang="scss">
#bookingConfirmed {
  position: relative;
  width: 100%;
  border-radius: 7px;

}

v-deep #bookingConfirmed .mapboxgl-ctrl {
  display: none !important;
}

.map-container {
  color:red;

  .mapboxgl-control-container {

    .mapboxgl-ctrl-logo {
      display: none !important;
    }
    
  }
}


.start-ride-button {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
