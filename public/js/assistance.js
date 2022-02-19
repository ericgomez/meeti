import axios from 'axios'

document.addEventListener('DOMContentLoaded', () => {
  const assistance = document.getElementById('confirm-assistance')

  if (assistance) {
    assistance.addEventListener('submit', confirmAssistance)
  }
})

const confirmAssistance = async e => {
  e.preventDefault()
}
