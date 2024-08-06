import axios from 'axios';

const baseURL = import.meta.env.DEV ? `http://localhost:3000/api` : `https://luxor.dev/kingfisher/api`

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

export const getNest = async (nestId) => {
  try {
    const result = await axiosInstance.get(`/nests/${nestId}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}

export const testRequest = async (nestId) => {
  const baseURL = import.meta.env.DEV ? 
                    `http://localhost:3000/api` : 
                    `https://kingfisher.luxor.dev`

  try {
    const result = await axios.get(`${baseURL}/!/${nestId}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}