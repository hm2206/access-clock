import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { types } from '@ioc:Adonis/Core/Helpers'
import Clock from 'wrapper-zkteco'
import collect from 'collect.js'
import SchemaImportAssistance from '../../Helpers/SchemaImportAssistance'
import PreAssistance from 'App/Models/PreAssistance'
import Assistance from 'App/Models/Assistance'
import Database from '@ioc:Adonis/Lucid/Database'
import moment from 'moment'

export default class AssistancesController {

    public async index ({ request }: HttpContextContract) {
        let currentDate = moment();
        let year = request.input('year', currentDate.year()) 
        let month = request.input('month', currentDate.month() + 1)
        let filtros = request.only(['ip'])
        let queryAssistances = Assistance.query()
        // filtros
        for (let attr in filtros) {
            let value = filtros[attr];
            if (Array.isArray(value)) queryAssistances.whereIn(attr, value)
            if (types.isString(value)) queryAssistances.where(attr, value)
        }
        // obtener datos
        let assistances = await queryAssistances.where(`year`, year)
            .where(`month`, month);
        // response
        return {
            success: true,
            status: 200,
            assistances
        }
    }

    public async syncronize ({ params, request, response } : HttpContextContract) {
        const ip = params.ip;
        const dateCurrent = moment()
        const year = request.input('year', dateCurrent.year())
        const month = request.input('month', dateCurrent.month() + 1)
        const clock = new Clock(ip)
        let { assistances , err } = await clock.getAttendents()
        .then(res => ({  total: res.total, assistances: res.assistencias, err: null }))
        .catch(err => ({ err }))
        if (err) response.status(502).send({
            success: false,
            status: 502,
            code: "ERR_SYNCRONIZE_ASSISTANCES"
        })
        // setting datos
        let datos = collect(assistances || []).where('year',  year).where('month', month);
        let payload : Object[] = []
        await datos.map((assistance: any) => {
            assistance.ip = ip
            let schemaImport = new SchemaImportAssistance(assistance)
            payload.push(schemaImport.toJSON())
        })
        // pre-guardar registros
        await PreAssistance.createMany(payload)
        // preparar consulta
        let querySelect = await PreAssistance.query()
            .select("ip", "user_device_id", "year", "month", "day", "time", Database.raw(`NOW()`), Database.raw(`NOW()`))
            .whereNotExists(build => {
                build.select(Database.raw("null"))
                    .from('assistances as a')
                    .where(`a.year`, Database.raw(`pre_assistances.year`))
                    .where(`a.month`, Database.raw(`pre_assistances.month`))
                    .where(`a.day`, Database.raw(`pre_assistances.day`))
                    .where(`a.time`, Database.raw(`pre_assistances.time`))
            }).toQuery()
        // gurdar registros
        await Database.rawQuery(`INSERT INTO assistances(ip, user_device_id, year, month, day, time, created_at, updated_at) ${querySelect}`);
        // truncar pre assistencia
        await PreAssistance.truncate()
        // response successfull
        return {
            success: true,
            status: 201,
            message: "Las asistencias se sincronizarón correctamente!!!",
        }
    }

}
