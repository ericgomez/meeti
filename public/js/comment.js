import axios from 'axios'
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', () => {
  const formDelete = document.querySelectorAll('.delete-comment')

  if (formDelete.length) {
    formDelete.forEach(form => {
      form.addEventListener('submit', deleteComment)
    })
  }
})

const deleteComment = e => {
  e.preventDefault()

  const form = e.target

  axios
    .post(form.action)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}
