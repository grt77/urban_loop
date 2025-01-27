<template>
  <div id="map" style="width: 100%; height: 250px;"></div>
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
  },
  data() {
    return {
      map: null,
      directionsServiceUrl: 'https://api.mapbox.com/directions/v5/mapbox/driving',
      mapInitialized: false,
      centerCordinates: [77.594566, 12.971599],
      routeGeojson: null,
      sourceMarker: null,
      destinationMarker: null,
    };
  },
  watch: {
    sourceCordinates: {
      handler() {
        if (this.sourceCordinates?.length && this.destinationCordinates?.length) {
          this.getRoute();
        } else {
          this.showSourcePlace();
        }
        if (this.sourceCordinates?.length) {
          this.sourceMarker = new mapboxgl.Marker().setLngLat(this.sourceCordinates).addTo(this.map);
        }
      }
    },
    destinationCordinates: {
      handler() {
        if (this.sourceCordinates?.length && this.destinationCordinates?.length) {
          this.getRoute();
        } else {
          this.showDestinationPlace();
        }
        if (this.destinationCordinates?.length) {
          this.destinationMarker = new mapboxgl.Marker({ color: 'red' }).setLngLat(this.destinationCordinates).addTo(this.map);
        }
      }
    }
  },
  mounted() {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.centerCordinates, // Initial center at the source location
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

          new mapboxgl.Marker({ color: 'red' })
            .setLngLat(this.destinationCordinates)
            .addTo(this.map);

          const bounds = new mapboxgl.LngLatBounds();
          route.forEach(coord => bounds.extend(coord));

          // Fit the map to the bounds
          this.map.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            maxZoom: 14,
          });
        } catch (error) {
          console.error('Error getting directions:', error);
        }
      }
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
    showSourcePlace() {
      if (this.mapInitialized) {
        this.map.flyTo({
          center: [this.sourceCordinates[0], this.sourceCordinates[1]],
          zoom: 14,
          speed: 2,
          curve: 1,
        });
      }
    },
    showDestinationPlace() {
      if (this.mapInitialized) {
        this.map.flyTo({
          center: [this.destinationCordinates[0], this.destinationCordinates[1]],
          zoom: 14,
          speed: 2,
          curve: 1,
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
#map {
  margin-bottom: 20px;

  canvas {
    height: 250px !important;
    /* Adjusting height */
  }
}
</style>
