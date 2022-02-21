import axios from 'axios'

document.addEventListener('DOMContentLoaded', () => {
  const assistance = document.getElementById('confirm-assistance')

  if (assistance) {
    assistance.addEventListener('submit', confirmAssistance)
  }
})

const confirmAssistance = e => {
  e.preventDefault()

  const form = e.target
  const btn = e.target[0]
  const message = document.getElementById('message')

  axios
    .post(form.action, {
      action: btn.value === 'Yes' ? 'confirm' : 'cancel'
    })
    .then(res => {
      if (btn.value === 'Yes') {
        btn.value = 'Cancel'
        btn.classList.remove('btn-blue')
        btn.classList.add('btn-red')
      } else {
        btn.value = 'Yes'
        btn.classList.remove('btn-red')
        btn.classList.add('btn-blue')
      }

      // remove the message previously if exists
      while (message.firstChild) {
        message.removeChild(message.firstChild)
      }

      //show message
      message.appendChild(document.createTextNode(res.data))
    })
    .catch(err => {
      console.log(err)
    })
}
