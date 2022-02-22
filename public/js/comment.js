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
  const commentId = form[0].getAttribute('data-id')

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(result => {
    if (result.isConfirmed) {
      axios
        .post(form.action, {
          commentId
        })
        .then(res => {
          Swal.fire('Deleted!', res.data, 'success')

          // remove the comment from the DOM
          form.parentElement.parentElement.remove()
        })
        .catch(err => {
          console.log(err.response)
          if (err.response.status === 401 || err.response.status === 404) {
            Swal.fire('Error', err.response.data, 'error')
          }
        })
    }
  })
}
