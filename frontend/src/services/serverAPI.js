import axios from 'axios';
import { randomHTTPMethod, randomURLPatch } from '../utils/helpers';

const developmentMode = import.meta.env.DEV

const baseURL = developmentMode ? 
                  `http://localhost:3000/api` : 
                  `https://luxor.dev/kingfisher/api`

const axiosInstance = axios.create({
  baseURL
})

export const createNest = async (source) => {
  let configuration = {}
  if (source) configuration['cancelToken'] = source.token

  try {
    const result = await axiosInstance.post('/createNest', {}, configuration)
    return result.data
  } catch(error) {
    if (error.name != 'CanceledError') console.error(error)
  }
}

export const getNest = async (nestId, source) => {
  let configuration = {}
  if (source) configuration['cancelToken'] = source.token

  try {
    const result = await axiosInstance.get(`/nests/${nestId}`, {}, configuration)
    return result.data
  } catch(error) {
    if (error.name != 'CanceledError') console.error(error)
  }
}

export const getWSMessages = async (nestId, serverURL) => {
  try {
    const result = await axiosInstance.get(
      `/wsm/${nestId}`,
      {
        headers: {
          'x-kingfisher-wsserverurl': serverURL
        }
      }
    )
    return result.data
  } catch(error) {
    if (error.name != 'CanceledError') console.error(error)
  }
}

export const testRequest = async (nestId) => {
  const baseURL = developmentMode ? 
                    `http://localhost:3000`: 
                    `https://kingfisher.luxor.dev`
  
  const HTTPMethod = randomHTTPMethod()
  let axiosService
  if (HTTPMethod === 'POST') axiosService = axios.post
  else if (HTTPMethod === 'PUT') axiosService = axios.put
  else if (HTTPMethod === 'HEAD') axiosService = axios.head
  else if (HTTPMethod === 'PATCH') axiosService = axios.patch
  else if (HTTPMethod === 'DELETE') axiosService = axios.delete
  else axiosService = axios.get

  try {
    const result = await axiosService(`${baseURL}/!/${nestId}/${randomURLPatch()}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}

export const createWSCustomClientInBackend = async (nestId, wsServerURL) => {
  try {
    const result = await axios.post(`${baseURL}/createWsConnection`, {nestId, wsServerURL})
    return result.data
  } catch(error) {
    console.error(error)
  }
}

export const closeWSCustomClientInBackend = async (nestId) => {
  try {
    const result = await axios.post(`${baseURL}/closeWsConnection/${nestId}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}