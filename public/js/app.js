import { OpenStreetMapProvider } from 'leaflet-geosearch'

const lat = 15.861618
const lng = -97.063522

const map = L.map('map').setView([lat, lng], 13)
let markers = new L.FeatureGroup().addTo(map)
let marker

document.addEventListener('DOMContentLoaded', () => {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  const search = document.getElementById('searchForm')
  search.addEventListener('input', searchDirection)
})

const searchDirection = e => {
  // debounce search
  clearTimeout(window.timer)
  window.timer = setTimeout(() => {
    // delete previous markers
    markers.clearLayers()

    const provider = new OpenStreetMapProvider()

    provider
      .search({ query: e.target.value || '' })
      .then(results => {
        const { x: lng, y: lat, label } = results[0]

        // show location in map
        map.setView([lat, lng], 13)

        // show pin in map
        marker = new L.marker([lat, lng], {
          draggable: true, // make the marker draggable
          autoPan: true // auto pan to the location
        })
          .addTo(map)
          .bindPopup(label) // bind a popup to the marker
          .openPopup() // open the popup

        // add marker to group
        markers.addLayer(marker)

        // detect dragend event
        marker.on('dragend', e => {
          const {
            _latlng: { lat, lng }
          } = e.target

          // update marker position
          map.panTo([lat, lng])
        })
      })
      .catch(err => console.error(err))
  }, 1000)
}

// debounce search
