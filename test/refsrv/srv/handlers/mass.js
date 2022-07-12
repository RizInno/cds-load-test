const cds = require('@sap/cds')

/**
 * Implementation of the Mass Change service handler
 */
class MassChangeService extends cds.ApplicationService {

    async init() {

        const namespace = 'riz.cds.lt' // Namespace defintion
        const serviceName = 'ReferenceService' // Service name

        // Connect to the service
        const srv = await cds.connect.to(serviceName);

        /**
         * Event handler for 'insertAll' action
         */
        this.on('insertAll', async (req) => {

            // Get reference to the entity defintion for the entity specified in the action
            const entity = srv.entities(namespace)[req.data.insEntity]

            // Assemble the Insert query
            const ins = INSERT.into(entity).entries(req.data.insArray)
            
            // Execute the query
            const res = await srv.run(ins)

            // Return results
            return {"value":res}
        })

        // ensure to call super.init()
        await super.init()
    }

}
module.exports = MassChangeService