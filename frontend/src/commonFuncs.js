import { SERVER_URL } from "./config";

export const getDomains = async() => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  var data;
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
  var data;
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