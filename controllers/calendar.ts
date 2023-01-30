import { Request, Response } from 'express'
import { CalendarDB, UsersDB } from '../db/index'
import { ICalendar, IIntervals, IUser } from '../types'
import moment from 'moment'

const keyByDates = (dates: IIntervals[]) => {
  const dateMap = new Map<string, IIntervals[]>([])
  dates.forEach((d) => {
    const date = moment(d.start).format('DD/MM/YYYY')
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
  duration: number = 15
) => {
  const startParsed = moment(start)
  const endParsed = moment(end)

  const bookedIntervalByDates = keyByDates(bookedIntervals)

  // round date to nearest duration mins
  startParsed.minutes(Math.ceil(startParsed.minutes() / duration) * duration)

  var result = []

  var current = moment(startParsed)

  while (current <= endParsed) {
    result.push({
      start: current.format('YYYY-MM-DD HH:mm'),
      end: current.add(15, 'minutes').format('YYYY-MM-DD HH:mm'),
    })
  }

  return result
}

export const getAvailabilityOfUser = (req: Request, res: Response) => {
  const userId = req.params['userid']
  const userWithIdExist = UsersDB.idAlreadyExist(userId)
  if (!userWithIdExist) {
    res.send({ error: 'user does not exist' }), 404
    return
  }
  const allBookings = CalendarDB.fetchElementByID<ICalendar>(userId, 'userId')
  const bookedIntervals = allBookings.map((b) => ({
    start: b.start,
    end: b.end,
  }))
  const userData = UsersDB.fetchElementByID<IUser>(userId, 'id')[0]
  const intervals = calculateIntervals(
    userData!.availability_start,
    userData!.availability_end,
    bookedIntervals
  )
  res.send(intervals)
}
