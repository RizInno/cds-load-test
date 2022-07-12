const cds = require('@sap/cds')
const express = require('express')
const log = cds.log('bootstrap')

cds.on('bootstrap', (app) => {
  // add your own middleware before any by cds are added
  const msgSizeLimit = '50mb'

  log.info('Increase message size to', msgSizeLimit)
  app.use(express.json({ limit: msgSizeLimit }));

})
cds.on('served', () => {
  // add more middleware after all CDS services
})
