import { Request, Response } from 'express'
import { CalendarDB, ServicesDB, UsersDB } from '../db/index'
import {
  ICalendar,
  IIntervals,
  ISchedulePayload,
  IServices,
  IUser,
} from '../types'
import moment from 'moment'

const isDateOverlapping = (date1: IIntervals, date2: IIntervals) => {
  const conditional =
    moment(date1.start).format(`HH:MM`) <= moment(date2.end).format(`HH:MM`) &&
    moment(date1.end).format(`HH:MM`) >= moment(date2.start).format(`HH:MM`)
  return conditional
}

const keyByDates = (dates: IIntervals[]) => {
  const dateMap = new Map<string, IIntervals[]>([])
  dates.forEach((d) => {
    const date = moment(d.start).format('YYYY-MM-DD')
    if (dateMap.get(date)) {
      dateMap.set(date, [...dateMap.get(date)!, d])
    } else {
      dateMap.set(date, [d])
    }
  })
  return dateMap
}

const calculateIntervals = (
  start: Date,
  end: Date,
  bookedIntervals: IIntervals[],
  date = '2023-01-31',
  duration: number = 15
) => {
  const startParsed = moment(start)
  const endParsed = moment(end)

  const bookedIntervalByDates = keyByDates(bookedIntervals)
  startParsed.minutes(Math.ceil(startParsed.minutes() / duration) * duration)

  var result = []

  var current = moment(startParsed)

  while (current <= endParsed) {
    const startDT: Date = current.format('YYYY-MM-DD HH:mm') as any as Date
    const endDT: Date = current
      .add(15, 'minutes')
      .format('YYYY-MM-DD HH:mm') as any as Date
    const bookedSlots = bookedIntervalByDates.get(date)
    const doNotAccount: IIntervals[] = []

    bookedSlots?.forEach((slot) => {
      const condt = isDateOverlapping(slot, { start: startDT, end: endDT })
      if (condt) {
        doNotAccount.push({ start: startDT, end: endDT })
      }
    })

    if (doNotAccount.length) {
      continue
    } else {
      result.push({
        start: startDT,
        end: endDT,
      })
    }
  }
  return result
}

export const getAvailabilityOfUserByDate = (req: Request, res: Response) => {
  const userId = req.params['userid']
  const payload: ISchedulePayload = req.body
  const isPayloadCorrct = Object.keys(payload).length
  if (!isPayloadCorrct) {
    res.send({ error: 'body missing in payload' }), 400
    return
  }
  const userWithIdExist = UsersDB.idAlreadyExist(userId)
  if (!userWithIdExist) {
    res.send({ error: 'user does not exist' }), 404
    return
  }
  const allBookings = CalendarDB.fetchElementByID<ICalendar>(userId, 'userId')
  const bookedIntervals = allBookings.map((b) => ({
    start: moment(b.start).format('YYYY-MM-DD HH:MM') as any as Date,
    end: moment(b.end).format('YYYY-MM-DD HH:MM') as any as Date,
  }))
  const userData = UsersDB.fetchElementByID<IUser>(userId, 'id')?.[0]
  const serviceRequested = ServicesDB.fetchElementByID<IServices>(
    payload.serviceId,
    'id'
  )?.[0]

  // we can extend this to support multiple dates

  const intervals = calculateIntervals(
    userData!.availability_start,
    userData!.availability_end,
    bookedIntervals,
    payload.date,
    serviceRequested.duration
  )
  const result: { [key: string]: IIntervals[] } = {}
  result[payload.date] = intervals
  res.send(result)
}
