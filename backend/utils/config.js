import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT
const WS_PORT = process.env.WS_PORT
const PG_USER = process.env.PG_USER
const PG_HOST = process.env.PG_HOST
const PG_DB = process.env.PG_DB
const PG_PASSWORD = process.env.PG_PASSWORD
const PG_PORT = process.env.PG_PORT

export default {
  PORT,
  WS_PORT,
  PG_USER, 
  PG_HOST, 
  PG_DB,
  PG_PASSWORD,
  PG_PORT,
}