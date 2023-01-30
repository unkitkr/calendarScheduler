import { Request, Response } from 'express'
import { UsersDB } from '../db/index'
import { IUser } from '../types'
export const getUserById = (req: Request, res: Response) => {
  const id = req.params['id']
  let user
  try {
    user = UsersDB.fetchElementByID(id, 'id')
  } catch (e) {
    res.send({ error: 'an internal error occured' }), 500
  }
  if (user) {
    res.send(user), 200
  } else {
    res.send({ error: "404 user doesn't exist" }), 404
  }
}

export const getAllUsers = (req: Request, res: Response) => {
  let user
  try {
    user = UsersDB.fetchAllData()
  } catch (e) {
    res.send({ error: 'an internal error occured' }), 500
  }
  if (user) {
    res.send(user), 200
  } else {
    res.send({ error: '404 no users exist' }), 404
  }
}

export const createUser = (req: Request, res: Response) => {
  const userPayload: IUser = req.body
  const userWithIdExist = UsersDB.idAlreadyExist(userPayload.id)
  if (userWithIdExist) {
    res.send({ error: 'user already exist' }), 409
    return
  }
  try {
    UsersDB.writeData<IUser>(userPayload)
  } catch (e) {
    res.send({ error: 'an internal error occured' }), 500
  }
  res.send({ success: 'user created' }), 200
}
