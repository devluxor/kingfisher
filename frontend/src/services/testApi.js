import axios from 'axios';

const baseURL = '/api'

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
    if (error.name !== 'CanceledError') {
      console.error(error)
    }
  }
}

export const getNestRequests = async (nestId) => {
  try {
    await axiosInstance.get(`/nests/${nestId}`)
  } catch(error) {
    console.error(error)
  }
}

export const testRequest = async (nestId) => {
  try {
    const result = await axios.get(`/!/${nestId}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}