import { Request, Response } from 'express'
import { CalendarDB, ServicesDB } from '../db/index'
import { ICalendarPayload, IServices } from '../types'

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
    ServicesDB.writeData(servicePayload)
  } catch (e) {
    res.send({ error: 'an internal error occured' }), 500
  }
  res.send({ success: 'Service created' }), 200
}

export const bookService = (req: Request, res: Response) => {
  const id = req.params['id']
  const payloadData: ICalendarPayload = req.body
  if (!payloadData) {
    res.send({ error: 'wrong body' }), 400
  }
  let service
  try {
    service = ServicesDB.fetchElementByID<IServices>(id, 'id')[0]
  } catch (e) {
    res.send({ error: 'an internal error occured' }), 500
  }
  const calendarPayload = {
    serviceId: service?.id,
    start: payloadData.start,
    end: payloadData.end,
    duration: service?.duration,
    userId: service?.userId,
  }

  try {
    CalendarDB.writeData(calendarPayload)
  } catch (e) {
    res.send({ error: 'an internal error occured' }), 500
  }
  res.send({ success: 'Service created' }), 200
}
