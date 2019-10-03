/* eslint-disable */

// MAPBOX
export const displayMap = locations => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoidGFzaGlsYSIsImEiOiJjazE4NzJrd3UxajY0M2RwZmphNW9yZHBsIn0.G1EPnMmc5td2tJjKOIc3Zw';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/tashila/ck1874spd0jsc1cmrcgip6gkk',
        scrollZoom: false
        // center: [],
        // zoom: 10,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};
