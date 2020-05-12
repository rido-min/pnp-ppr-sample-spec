
const dtservice = require('azure-iot-digitaltwins-service')

const connectionString = process.env.IOTHUB_CONNECTION_STRING
const deviceId = process.env.DEVICE_ID
const componentName = 'tempSensor1'


const digitalTwinServiceClient = new dtservice.DigitalTwinServiceClient(
    new dtservice.IoTHubTokenCredentials(connectionString))

const main = async() => {

    const twin = await digitalTwinServiceClient.getDigitalTwin(deviceId)
    console.log(twin.$metadata.$model)
    console.log(twin[componentName])

    console.log('====> Invoking command Reboot')
    const commandResp = await digitalTwinServiceClient.invokeComponentCommand(deviceId, 'diag', 'reboot', 3)
    console.log(commandResp)

    const patch = [{ op: 'add', path: '/tempSensor1', value: { 'targetTemperature': 5.6, '$metadata': {} } }];
    const updResp = await digitalTwinServiceClient.updateDigitalTwin(deviceId, patch);
    console.log(updResp)
}

main()