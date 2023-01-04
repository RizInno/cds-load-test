import Application from '../lib/app.js'
import file from 'fs'

// Read config file
const config = JSON.parse(file.readFileSync('./config/default.json', 'utf8'))

// Execute app with config from file
new Application(config).run()
