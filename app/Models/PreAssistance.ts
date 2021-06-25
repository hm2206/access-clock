import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PreAssistance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ip: string

  @column()
  public userDeviceId: string

  @column()
  public year: Number

  @column()
  public month: Number

  @column()
  public day: Number

  @column()
  public time: any
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
