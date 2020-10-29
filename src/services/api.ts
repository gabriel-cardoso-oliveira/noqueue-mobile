import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.100.35:3333'
  // baseURL: 'http://192.168.43.176:3333'
})

export default api;
