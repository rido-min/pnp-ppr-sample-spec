'use strict'

const os = require('os')

const DigitalTwinClient = require('azure-iot-digitaltwins-device').DigitalTwinClient

const DeviceInformation = require('./deviceInformation').DeviceInformation
const SdkInformation = require('./sdkInformation').SdkInformation
const TemperatureSensor = require('./temperatureSensor').TemperatureSensor
const Diagnostics = require('./diagnostics').Diagnostics

const modelId = 'dtmi:com:example:Thermostat;1'
const connectionString = process.env.DEVICE_CONNECTION_STRING

let currentTemp = 20
let targetTemp = 20
let telemetryLoop = {}

const propertyUpdateHandler = async (component, propertyName, reportedValue, desiredValue, version) => {
  console.log('Received an update for ' + propertyName + ': ' + JSON.stringify(desiredValue))
  targetTemp = parseFloat(JSON.stringify(desiredValue))
  await adjustTemp(targetTemp)
  await digitalTwinClient.report(component, { [propertyName]: desiredValue }, {
    code: 200,
    description: 'success',
    version: version
  })
  console.log('updated the property')
}

const commandHandler = async (request, response) => {
  console.log('received command: ' + request.commandName + ' for component: ' + request.componentName + ' with payload ' + request.payload)
  if (request.commandName === 'reboot') {
    // currentTemp = 0
    targetTemp = 21
    const delay = parseInt(request.payload)
    clearInterval(telemetryLoop)
    for (let index = 0; index < delay; index++) {
      console.log('==================> REBOOT COMMAND RECEIVED <=================')
      await sleep(index * 1000)
    }
    await startTelemetryLoop()
    response.acknowledge(200, 'Command processed successfully')
    console.log('acknowledgement succeeded.')
  } else {
    response.acknowledge(404, `Unknown command: ${request.commandName}`)
  }
}

const digitalTwinClient = DigitalTwinClient.fromConnectionString(modelId, connectionString)

const tempSensor = new TemperatureSensor('tempSensor1', propertyUpdateHandler)
const deviceInformation = new DeviceInformation('deviceInfo')
const sdkInformation = new SdkInformation('sdkInfo')
const diag = new Diagnostics('diag', commandHandler)

const thisSdkInfo = {
  language: 'node',
  version: '1.0.0-pnp-refresh.0',
  vendor: 'Microsoft'
}

const thisDeviceInfo = {
  manufacturer: 'Azure IoT Samples',
  model: 'Thermostat.PnP-PPR-Node',
  swVersion: '0.1',
  osName: os.platform(),
  processorArchitecture: os.arch(),
  processorManufacturer: 'Contoso Industries',
  totalStorage: 65000,
  totalMemory: os.totalmem()
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const adjustTemp = async (target) => {
  const step = (target - currentTemp) / 10
  for await (const index of [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]) {
    console.log('updating current temp to ' + currentTemp)
    currentTemp = target - step * parseFloat(index)
    await sleep(1000)
  }
}

const startTelemetryLoop = async () => {
  telemetryLoop = setInterval(async () => {
    console.log('sending temp ' + currentTemp)
    await digitalTwinClient.sendTelemetry(tempSensor, { temperature: currentTemp })
    digitalTwinClient.report(tempSensor, { currentTemperature: currentTemp })
    await digitalTwinClient.sendTelemetry(diag, { workingset: os.freemem() })
  }, 2000)
}

const main = async () => {
  digitalTwinClient.addComponents(tempSensor, deviceInformation, sdkInformation, diag)
  digitalTwinClient.enableCommands()
  await digitalTwinClient.enablePropertyUpdates()
  await digitalTwinClient.report(deviceInformation, thisDeviceInfo)
  await digitalTwinClient.report(sdkInformation, thisSdkInfo)
  await startTelemetryLoop()
}

main()
