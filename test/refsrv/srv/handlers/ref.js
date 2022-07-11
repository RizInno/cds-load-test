const cds = require('@sap/cds')

/**
 * Implementation of the reference service handler
 */
class RefSrv extends cds.ApplicationService{

    async init(){
       
        /**
         * Event handler for 'deleteAllRecs' action
         */
        this.on('poolSettings', async () => {

            let returnString = 'Pool config not specified in package.json'

            if (cds.env.requires.db.pool){
                returnString = JSON.stringify(cds.env.requires.db.pool)
            }

            return returnString
        })

        /**
         * Event handler for 'deleteAllRecs' action
         */
        this.on('deleteAllRecs', async () => {

            // Connect to DB
            const srv = await cds.connect.to("db")
            

            // Determine MetaData for Test Records
            let { TestRecords } = srv.entities
      
            // Delete all Test Records
            await srv.run(DELETE.from(TestRecords))
        
            return
        })

         // ensure to call super.init()
        await super.init()
    }

}
module.exports = RefSrv