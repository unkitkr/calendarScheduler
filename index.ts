import express, { Request } from 'express'
import { PORT } from './config'
import { ICalendar, IServices } from './types'

const scheduleDb: ICalendar[] = []
const servicesDb: IServices[] = []

const app = express()
app.use(express.json())

app.get('/services', (req, res) => {
  res.send(servicesDb)
})

app.post('/services', (req: Request, res) => {
  const payload = req.body as IServices
  servicesDb.push(payload)
  res.send(servicesDb)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
