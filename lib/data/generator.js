import { v4 } from 'uuid';

export default class Generator {


    constructor() {

    }

    _getRandomNr(floor, ceiling) {

        return floor + Math.floor(Math.random() * (ceiling - floor + 1));

    }

    getData4CsnType(csnType) {

        if (csnType.type === 'cds.String' || csnType.type === 'cds.LargeString') {
            return this.getString(csnType)
        } else if (csnType.type === 'cds.Boolean') {
            return this.getBoolean()
        } else if (csnType.type === 'cds.Integer' || csnType.type === 'cds.Integer64') {
            return this.getInteger(csnType)
        } else if (csnType.type === 'cds.DecimalFloat' || csnType.type === 'cds.Double') {
            return this.getFloat(csnType)
        }else if (csnType.type === 'cds.Timestamp' || csnType.type === 'cds.DateTime') {
            return this.getTimeStamp()
        }
        else if (csnType.type === 'cds.Date' ) {
            return this.getDate()
        } 
        else if (csnType.type === 'cds.Time' ) {
            return this.getTime()
        }
        else if (csnType.type === 'cds.UUID' ) {
            return this.getUUID()
        } 
    }

    getUUID(){
        return v4()
    }

    getTime(){
        return this.getTimeStamp().slice(11,19)
    }


    getDate(){
        return this.getTimeStamp().slice(0,10)
    }

    getTimeStamp(){
        
        let ts = this._getRandomNr(-500000000, 5000000000000) + Math.fround(this._getRandomNr(-5000000, 5000000) / this._getRandomNr(-5000000, 5000000)  )
    
        let curDate = new Date(ts)
        return curDate.toISOString()
    }


    getFloat(csnType) {
        return this._getRandomNr(-5000, 5000) / this._getRandomNr(-5000, 5000)
    }

    getBoolean() {
        if (this._getRandomNr(0, 1) == 0) {
            return true
        } else {
            return false
        }

    }

    getInteger(csnType) {
        let lower = -2000
        let upper = 2000
        if (csnType.type === 'cds.Integer64') {
            // reset upper and lower
            let lower = -500000
            let upper = 500000

        }

        return this._getRandomNr(lower, upper)
    }

    getString(csnType) {

        let length = csnType.length || 5000
    //    console.log("length is", length)

        let s = ''

        for (let z = 0; z < this._getRandomNr(5, length); z++) {

            s += this._getRandomChar()
        }

      //  console.log('String ', s)
        return s

    }

    _getRandomChar() {

        return String.fromCharCode(this._getRandomNr(65, 122))
    }
}