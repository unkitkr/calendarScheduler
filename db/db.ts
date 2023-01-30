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
    writeFileSync(this.dbName, JSON.stringify(existingData.push(data)))
  }

  /**
   *
   * @param db name of database
   * @returns all entities in the database
   */
  public readAllData = <T>() => {
    const existingData = JSON.parse(readFileSync(this.dbName, 'utf-8'))
    return existingData as T[]
  }

  public getElementByID = <T>(id: string | number) => {
    const existingData: T[] = JSON.parse(readFileSync(this.dbName, 'utf-8'))
    return existingData.filter((f: any) => f.id === id)
  }
}

export const Users = new DB(dbPaths.USER_DB)
export const Calendar = new DB(dbPaths.USER_CALENDAR)
export const Services = new DB(dbPaths.USER_SERVICES)
