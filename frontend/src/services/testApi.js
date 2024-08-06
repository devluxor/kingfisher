import axios from 'axios';

const baseURL = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api'

const axiosInstance = axios.create({
  baseURL
})

export const createNest = async (source) => {
  try {
    const result = await axiosInstance.post('/createNest', {}, {
      cancelToken: source.token
    })
    return result.data
  } catch(error) {
    if (error.name != 'CanceledError') console.error(error)
  }
}

export const getNest = async (nestId) => {
  try {
    const result = await axiosInstance.get(`/nests/${nestId}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}

export const testRequest = async (nestId) => {
  const URL = import.meta.env.DEV ? 'http://localhost:3000' : ''

  try {
    const result = await axios.get(`${URL}/!/${nestId}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}