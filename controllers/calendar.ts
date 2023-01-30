import { Request, Response } from 'express'
import { CalendarDB, UsersDB } from '../db/index'
import { IUser } from '../types'
import moment from 'moment'

const calculateIntervals = (start: Date, end: Date, duration: number = 15) => {
  const startParsed = moment(start)
  const endParsed = moment(end)

  // round date to nearest 15 mins
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
  const allBookings = CalendarDB.fetchElementByID(userId, 'userId')
  const userData = UsersDB.fetchElementByID<IUser>(userId, 'id')[0]
  const intervals = calculateIntervals(
    userData!.availability_start,
    userData!.availability_end
  )
  res.send(intervals)
}
