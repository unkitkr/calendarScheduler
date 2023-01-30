export interface ICalendar {
  serviceId: string
  start: Date
  end: Date
  duration: number
  userId: string
}

export interface ICalendarPayload {
  start: Date
  end: Date
  duration: number
}

export interface IServices {
  name: string
  id: string
  duration: number
  userId: string
}

export interface IUser {
  fname: string
  lname: string
  availability_start: Date
  availability_end: Date
  id: string
}
