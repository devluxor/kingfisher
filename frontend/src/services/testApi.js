import axios from 'axios';

const baseURL = 'http://localhost:3000/api'

const axiosInstance = axios.create({
  baseURL
})

export const createNest = async (source) => {
  // should return a 200 code, with
  // id of nest in request 
  try {
    const result = await axiosInstance.post('/createNest', {
      data: 'data about the agent'
    }, {
      cancelToken: source.token
    })

    return result.data
  } catch(error) {
    console.error(error)
  }
}

export const getNestRequests = async (nestId) => {
  try {
    const result = await axiosInstance.get(`/${nestId}`)
    return result.data
  } catch(error) {
    console.error(error)
  }
}