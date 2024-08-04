import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT
const WS_PORT = process.env.WS_PORT

export default {
  PORT,
  WS_PORT
}