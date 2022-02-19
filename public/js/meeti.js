document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('location-meeti')) {
    showMap()
  }
})

const showMap = () => {
  const lat = document.getElementById('lat').value
  const lng = document.getElementById('lng').value
  const address = document.getElementById('address').value
  const map = L.map('location-meeti').setView([lat, lng], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(address)
    .openPopup()
}
