export interface ICalendar {
  serviceId: string
  start: Date
  end: Date
}

export interface IServices {
  name: string
  id: string
  duration: number
  userId: number
}

export interface IUser {
  fname: string
  lname: string
  availability_start: Date
  availability_end: Date
  id: string
}
