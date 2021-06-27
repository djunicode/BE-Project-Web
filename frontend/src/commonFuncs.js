import { SERVER_URL } from "./config";
import Swal from 'sweetalert2';

export const getDomains = async() => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  var data = [];
  await fetch(`${SERVER_URL}/get_domains`, requestOptions)
    .then(response => response.json())
    .then(result => { 
      data = result;
    })
    .catch(error => console.log('error', error));
  
  return data;
}

export const getTeachers = async() => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  var data = [];
  await fetch(`${SERVER_URL}/teachers`, requestOptions)
    .then(response => response.json())
    .then(result => {
      data = result;
    })
    .catch(error => console.log('error', error));

  return data;
}

export const getOptionsForYear = () => {
  let curr = new Date().getFullYear();
  let data = [];
  for(let i = curr;i>=2015;i--)
  {
    data.push(i);
  }
  return data;
}

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})