import axios from 'axios';

const port = import.meta.env.DEV ? '3000' : '3002'
const baseURL = `http://localhost:${port}/api`

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
  try {
    const result = await axios.get(`${baseURL}/!/${nestId}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}