import { Request, Response } from 'express'
import { ServicesDB } from '../db/index'
import { IServices } from '../types'

export const getServiceById = (req: Request, res: Response) => {
  const id = req.params['id']
  let service
  try {
    service = ServicesDB.fetchElementByID<IServices>(id, 'id')
  } catch (e) {
    res.send({ error: 'an internal error occured' }), 500
  }
  if (service) {
    res.send(service), 200
  } else {
    res.send({ error: "404 user doesn't exist" }), 404
  }
}
export const createService = (req: Request, res: Response) => {
  const servicePayload: IServices = req.body
  const serviceWithIdExist = ServicesDB.idAlreadyExist(servicePayload.id)
  if (serviceWithIdExist) {
    res.send({ error: 'service already exist' }), 409
    return
  }
  try {
    ServicesDB.writeData<IServices>(servicePayload)
  } catch (e) {
    res.send({ error: 'an internal error occured' }), 500
  }
  res.send({ success: 'Service created' }), 200
}
