import { OpenStreetMapProvider } from 'leaflet-geosearch'
import * as Geocoding from 'esri-leaflet-geocoder'

import assistance from './assistance'

//Reverse geocoding - get address from lat-lng
const geocodeService = Geocoding.geocodeService({
  apikey:
    'AAPKf2cd41a3a82f40a0aec0ca4dc2c37430CQIXi2F35seg8WeZsNc8Sc8vNvf9VDmMXSIBf5Psave4PVn2GLbVaKsIzl--jaL3'
})

const lat = document.getElementById('lat').value || 15.861618
const lng = document.getElementById('lng').value || -97.063522
const address = document.getElementById('address').value || ''

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
        // console.log(results[0].bounds[0])
        const { y: lat, x: lng, label } = results[0]

        // Reverse geocoding - get address from lat-lng
        geocodeService
          .reverse()
          .latlng({ lat, lng })
          .run((error, result) => {
            if (error) {
              console.log(error)
            } else {
              getLocation(result)

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

                // Reverse geocoding - get address from lat-lng
                geocodeService
                  .reverse()
                  .latlng({ lat, lng })
                  .run((error, result) => {
                    if (error) {
                      console.log(error)
                    } else {
                      getLocation(result)

                      // update marker label
                      marker.setPopupContent(result.address.LongLabel)
                    }
                  })
              })
            }
          })
      })
      .catch(err => console.error(err))
  }, 1000)
}

const getLocation = result => {
  document.getElementById('address').value = result.address.Address || ''
  document.getElementById('city').value = result.address.City || ''
  document.getElementById('state').value = result.address.Region || ''
  document.getElementById('country').value = result.address.CountryCode || ''
  document.getElementById('lat').value = result.latlng.lat || ''
  document.getElementById('lng').value = result.latlng.lng || ''
}

if (lat && lng) {
  markers.clearLayers()

  marker = new L.marker([lat, lng], {
    draggable: true, // make the marker draggable
    autoPan: true // auto pan to the location
  })
    .addTo(map)
    .bindPopup(address) // bind a popup to the marker
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

    // Reverse geocoding - get address from lat-lng
    geocodeService
      .reverse()
      .latlng({ lat, lng })
      .run((error, result) => {
        if (error) {
          console.log(error)
        } else {
          getLocation(result)

          // update marker label
          marker.setPopupContent(result.address.LongLabel)
        }
      })
  })
}
