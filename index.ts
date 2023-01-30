import express from 'express'
import { PORT } from './config'
import { servceController, userController } from './controllers'

const app = express()
app.use(express.json())

app.get('/user/:id', userController.getUserById)
app.post('/user', userController.createUser)
app.get('/user', userController.getAllUsers)
app.get('/user/:id/services', userController.getServicesByUserId)

app.get('/service/:id', servceController.getServiceById)
app.post('/service', servceController.createService)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
