<template>
  <div id="map" style="width: 100%; height: 350px;"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default {
  name: 'MapBox',
  props: {
    sourceCordinates: {
      type: Array,
      default: () => [],
    },
    destinationCordinates: {
      type: Array,
      default: () => [],
    },
    placeCurrentLocation: {
      type: Boolean,
      default: false,
    },
    placeDestinationLocation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      map: null,
      directionsServiceUrl: 'https://api.mapbox.com/directions/v5/mapbox/driving',
      mapInitialized: false,
      routeGeojson: null,
    };
  },
  watch: {
    placeCurrentLocation: {
      handler(val) {
        if (val) {
          this.pickCurrentLocation();
        }
      }
    },
    placeDestinationLocation: {
      handler(val) {
        if (val) {
          this.getRoute();
        }
      }
    }
  },
  mounted() {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.sourceCoord, // Initial center at the source location
      zoom: 6,
      attributionControl: false,
    });

    this.map.on('load', () => {
      this.mapInitialized = true;
    });
  },
  methods: {
    async getRoute() {
      if (this.mapInitialized) {
        // console.log(this.sourceCordinates, this.destinationCor)
        try {
          const query = await fetch(
            `${this.directionsServiceUrl}/${this.sourceCordinates[0]},${this.sourceCordinates[1]};${this.destinationCordinates[0]},${this.destinationCordinates[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
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

          const bounds = new mapboxgl.LngLatBounds();
          route.forEach(coord => bounds.extend(coord)); // Extend bounds to fit the route

          // Fit the map to the bounds
          this.map.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 }, // Add some padding for better visibility
            maxZoom: 14, // Optionally limit the zoom level
          });
        } catch (error) {
          console.error('Error getting directions:', error);
        }
      }
    },

    // Function to add the route layer to the map
    addRouteToMap(routeGeojson) {
      // Remove previous routes if any
      if (this.map.getSource('route')) {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      }

      // Add new route source and layer
      this.map.addSource('route', {
        type: 'geojson',
        data: routeGeojson, // Pass the valid GeoJSON object (this was the change)
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
          'line-width': 8,
        },
      });
    },

    pickCurrentLocation() {
      // Check if geolocation is available
      if (this.mapInitialized) {
              console.log(this.sourceCordinates, 'SOURCE_CORDINATES')
              // Fly to the current location
              this.map.flyTo({
                center: [this.sourceCordinates[0], this.sourceCordinates[1]], // Set the coordinates for the center
                zoom: 14, // Adjust zoom to make sure it's closer to the current location
                speed: 2, // Adjust speed of flyTo
                curve: 1, // Smooth out the movement
              });

              // Add a marker at the current locat
            }
    }
  },
};
</script>

<style lang="scss" scoped>
#map {
  margin-bottom: 20px;

  canvas {
    height: 350px !important;
    /* Adjusting height */
  }
}
</style>
