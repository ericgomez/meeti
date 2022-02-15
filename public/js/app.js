import { OpenStreetMapProvider } from 'leaflet-geosearch'

const lat = 15.861618
const lng = -97.063522

const map = L.map('map').setView([lat, lng], 13)

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
    const provider = new OpenStreetMapProvider()

    provider
      .search({ query: e.target.value || '' })
      .then(results => {
        const { x: lng, y: lat, label } = results[0]

        // show location in map
        map.setView([lat, lng], 13)

        // show pin in map
        L.marker([lat, lng], {
          draggable: true, // make the marker draggable
          autoPan: true // auto pan to the location
        })
          .addTo(map)
          .bindPopup(label) // bind a popup to the marker
          .openPopup() // open the popup
      })
      .catch(err => console.error(err))
  }, 1000)
}

// debounce search
