const Client = require('azure-iot-device').Client
var mqtt = require('azure-iot-device-mqtt').Mqtt

const modelid = "dtmi:com:examples:Thermostat;2"


const main = async () => {
    const deviceClient = Client.fromConnectionString(process.env.DEVICE_CONNECTION_STRING, mqtt)
   // deviceClient.setOptions({deviceCapabilityModel:modelid})

    await deviceClient.open()
    const twin1 = await  deviceClient.getTwin()
    console.log(twin1)

    twin1.properties.reported.update({'myNS:myProp1' : {myObj : {name:'rido, age:22'}}})
    
    twin1.on('properties.desired', (twinData) => {
        console.log('desired props')
        console.log(twinData)
    })
    
    deviceClient.onDeviceMethod('reboot', (req,resp) => {
        console.log('reboot')
        resp.send(200, 'ok', e => console.log(e))
    })
}

main()
