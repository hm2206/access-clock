import moment from 'moment'

export default class SchemaImportAssistance {

    private ip: String
    private userDeviceId: String
    private year: Number
    private month: Number
    private day: Number
    private time: any 

    constructor (assistance: any) {
        this.ip = assistance.ip
        this.userDeviceId = assistance.NumeroCredencial
        this.year = assistance.Anio
        this.month = assistance.Mes
        this.day = assistance.Dia
        this.time = moment(`${assistance.Hora}:${assistance.Minuto}:${assistance.Segundo}`, 'HH:mm:ss').format('HH:mm:ss')
    }

    public toJSON() {
        return {
            ip: this.ip,
            userDeviceId: this.userDeviceId,
            year: this.year,
            month: this.month,
            day: this.day,
            time: this.time
        }
    }

}