<template>
  <div ref="mapContainer" class="map-container" style="height: 250px;"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import { mapGetters } from 'vuex';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default {
  data() {
    return {
      map: null,
      sourceCoordinates: [], // Replace with your starting coordinates
      destinationCoordinates: [], // Replace with your destination coordinates
      autoMarker: null,
      route: [], // The route between source and destination (array of coordinates)
      moveInterval: null,
      distanceCovered: 0, // Keep track of the distance covered along the route
    };
  },
  computed: {
    ...mapGetters({
      sourceDetails: 'getSourceDetails',
      destinationDetails: 'destinationDetails',
    }),
  },
  mounted() {
    this.sourceCoordinates = [this.sourceDetails?.longitude, this.sourceDetails?.latitude];
    this.destinationCoordinates = [this.destinationCoordinates?.longitude, this.destinationCoordinates?.latitude];
    console.log(this.sourceCoordinates, this.destinationCoordinates)
    // Initialize Mapbox
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN; // Replace with your Mapbox token
    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.sourceCoordinates,
      zoom: 12,
      attributionControl: false,
    });

    this.map.on('load', () => {
      this.mapInitialized = true;
    });

    // Add start and destination markers
    this.addMarkers();

    // Generate a route (for simplicity, we'll assume it's a straight line for this example)
    this.generateRoute();

    // Start moving the auto symbol
    this.startMovingAuto();
  },
  beforeDestroy() {
    // Clean up map and interval when component is destroyed
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    addMarkers() {
      // Add start and destination markers
      new mapboxgl.Marker().setLngLat(this.sourceCoordinates).addTo(this.map);
      new mapboxgl.Marker().setLngLat(this.destinationCoordinates).addTo(this.map);

      // Add the auto marker (we'll move this later)
      this.autoMarker = new mapboxgl.Marker({ color: 'red' }).setLngLat(this.sourceCoordinates).addTo(this.map);
    },
    generateRoute() {
      // For simplicity, create a straight line between the source and destination
      // In a real-world scenario, use a routing API like Mapbox Directions API
      const route = [this.sourceCoordinates, this.destinationCoordinates];
      this.route = route;
    },
    startMovingAuto() {
      const totalDistance = this.calculateDistance(this.sourceCoordinates, this.destinationCoordinates);
      const speed = 0.05; // Move 5% of the total distance per interval

      this.moveInterval = setInterval(() => {
        if (this.distanceCovered < totalDistance) {
          this.distanceCovered += speed;
          const currentPosition = this.interpolateRoute(this.distanceCovered / totalDistance);
          this.autoMarker.setLngLat(currentPosition); // Update auto marker position
        } else {
          clearInterval(this.moveInterval); // Stop moving when destination is reached
        }
      }, 100);
    },
    calculateDistance(start, end) {
      // Simple function to calculate the distance between two coordinates (in kilometers)
      const R = 6371; // Earth's radius in km
      const [lat1, lon1] = start;
      const [lat2, lon2] = end;

      const dLat = this.degreesToRadians(lat2 - lat1);
      const dLon = this.degreesToRadians(lon2 - lon1);

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    },
    interpolateRoute(progress) {
      // Interpolate the route based on progress (0 to 1)
      const lat1 = this.sourceCoordinates[1];
      const lon1 = this.sourceCoordinates[0];
      const lat2 = this.destinationCoordinates[1];
      const lon2 = this.destinationCoordinates[0];

      const lat = lat1 + progress * (lat2 - lat1);
      const lon = lon1 + progress * (lon2 - lon1);

      return [lon, lat]; // Return the interpolated coordinates
    },
    degreesToRadians(degrees) {
      return degrees * Math.PI / 180;
    }
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
