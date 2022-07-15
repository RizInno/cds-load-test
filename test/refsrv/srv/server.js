const cds = require('@sap/cds')
const express = require('express')

cds.on('bootstrap', async (app) => {
  // add your own middleware before any by cds are added

  // set message size limit to 50MB
  const msgSizeLimit = '50mb'
  
  // Add middleware to limit the size of the request body
  await app.use(express.json({ limit: msgSizeLimit }));

})
