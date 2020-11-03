import axios from 'axios'
import { baseUrl } from './../utils/baseUrl'

const api = axios.create({
  baseURL: baseUrl.url
  // baseURL: 'http://192.168.43.176:3333'
})

export default api;
