import { Loggable } from "../@types/utils.js"

const info = (...params: Loggable[]) => {
  console.log(...params)
}

const error = (...params: Loggable[]) => {
  console.error(...params)
}

export default {
  info, 
  error,
}