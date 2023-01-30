import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dbPaths } from '../config'

// Just for fun :D

class DB {
  private dbName: dbPaths
  private initFunction() {
    if (!existsSync(dbPaths.USER_CALENDAR)) {
      writeFileSync(dbPaths.USER_CALENDAR, JSON.stringify([]))
    }
    if (!existsSync(dbPaths.USER_DB)) {
      writeFileSync(dbPaths.USER_DB, JSON.stringify([]))
    }
    if (!existsSync(dbPaths.USER_SERVICES)) {
      writeFileSync(dbPaths.USER_SERVICES, JSON.stringify([]))
    }
  }
  constructor(dbName: dbPaths) {
    this.dbName = dbName
    // Create if not updated condition
    this.initFunction()
  }

  /**
   *
   * @param db name of database
   * @param data data to be inserted
   */
  public writeData = <T>(data: T) => {
    const existingData: T[] = JSON.parse(readFileSync(this.dbName, 'utf-8'))
    existingData.push(data)
    writeFileSync(this.dbName, JSON.stringify(existingData))
  }

  public idAlreadyExist = (id: string) => {
    const existingData: any[] = this.fetchAllData()
    const isExisting = existingData?.filter((f: any) => f.id === id)
    return isExisting && isExisting.length ? true : false
  }

  /**
   *
   * @param db name of database
   * @returns all entities in the database
   */
  public fetchAllData = <T>() => {
    const existingData = JSON.parse(readFileSync(this.dbName, 'utf-8'))
    return existingData as T[]
  }

  public fetchElementByID = <T>(id: string | number, entity: string) => {
    const existingData: T[] = JSON.parse(readFileSync(this.dbName, 'utf-8'))
    return existingData.filter((f: any) => eval(`f.${entity}`) === id)
  }
}

export const UsersDB = new DB(dbPaths.USER_DB)
export const CalendarDB = new DB(dbPaths.USER_CALENDAR)
export const ServicesDB = new DB(dbPaths.USER_SERVICES)
