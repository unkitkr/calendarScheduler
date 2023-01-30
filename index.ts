import express, { Request } from 'express'
import { PORT } from './config'
import { ICalendar, IServices } from './types'
import { UsersDB, CalendarDB, ServicesDB } from './db'
import { servceController, userController } from './controllers'

const app = express()
app.use(express.json())

app.get('/user/:id', userController.getUserById)
app.post('/user', userController.createUser)
app.get('/user', userController.getAllUsers)

app.get('/service/:userid', servceController.getServiceByUserId)
app.post('/service', servceController.createService)

app.post('/services', (req, res) => {
  const payload = req.body as IServices
  try {
    ServicesDB.writeData<IServices>(payload)
    res.send({ success: 'Service Added' }), 200
  } catch (e) {
    res.send({ error: 'error occured' }), 500
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
