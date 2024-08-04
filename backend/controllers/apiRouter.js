import { Router } from "express";

const apiRouter = Router()

let id = 0
let data = []

apiRouter.get('/nest-test', async (req, res, next) => {
  console.log('✌ Request received in API')
  try {
    res.status(200).send(data)
  } catch (e) {
    next(e); // Pass the error to the next middleware (error handler, etc.)
  }
})

apiRouter.post('/nest-test', async (req, res) => {
  data.push({id: id++})
  res.status(200).send()
})

export default apiRouter