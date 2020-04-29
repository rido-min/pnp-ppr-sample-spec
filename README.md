# Plug and Play samples spec for May 2020 release

> This spec describes the e2e sample we will use for the next BugBash, and eventually will be published as a tutorial in docs.ms.com.

## Intro

PnP is a set of technologies designed to make it easier to build IoT Solutions based on Azure IoT Hub. To address the needs for device and cloud developers the tutorial must target both.

Devices connected to IoT Hub can de described with DTDL, in terms of:

- Properties (Available trough Twins)
- Commands (Using the Hub Direct Methods feature)
- Telemetry (processed through EventHub)

### Bug Bash notes

For a BugBash, the instructions should not duplicate content already  available like READMEs or Docs, instead the instructions should help to find information that is not easy to find (not yet indexed, not available publicly, etc.. )

Each section in the Bug Bash can have different activities targeting different levels of complexity:

1. **Basic**. These are the minimal instructions to complete the scenario. This is the _happy path_ and should be easy to complete. Eg. Send temperature
2. **Intermediate**. Offer additional activities to explore the feature in depth. Eg. Use different semantic data types.
3. **Advanced**. Additional activities that will stress the feature being evaluated. Eg. Create telemetry using complex object types.

### Private environments, and preview SDKs

As the time of writing the version of IoT Hub supporting PnP BugBash 2, 08 May2020 release is only deployed to a private hub instance:

```
<Connection Strings for IoT Hub>
```

The SDKs required to use these features are in the `public-preview-pnp` branches

The tools are available as internal previews:

- Azure IoT Explorer (TBD)
- VSCode extension for DTDL (TBD)

## Sample Solution  Features

The solution to build includes 2 devices connected to Azure IoT using Central (SaaS) or Hub (PaaS). 

SaaS solution require to configure th Central application creating device templates based on the DTDL models. Central does not supoprt DTLD v2. It's out of scope for this BugBash.

PaaS solutions require some kind of computing resource to connect to the service endpoints, usually REST, by using the Service Client SDKs.

This BugBash uses the following Models to describe the devices features to implement.

We we'll use two common interfaces:

- [DeviceInformation](./models/DeviceInformation.json) (Common)
- [SDKInformation](./models/SDKInformation.json) (Common)

And a custom interface to monitor the memory and enable reboots:

- [Diagnostics](./models/Diagnostics.json) (Custom)

### Device1. Thermostat

This device simulates a temperature sensor, and uses the next interfaces:

<details>

<summary>Thermostat model</summary>

```json
{
  "@id": "dtmi:azsamples:iotdd:Thermostat;1",
  "@type": "Interface",
  "contents": [
    {
      "@type": "Component",
      "schema": "dtmi:azsamples:iotdd:TemperatureSensor;1",
      "name": "tempSensor1"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azure:DeviceManagement:DeviceInformation;1",
      "name": "deviceInfo"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azure:Client:SDKInformation;1",
      "name": "sdkInfo"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azsamples:iotdd:diagnostics;1",
      "name": "diag"
    }
  ]
}
```

</details>

<details>

<summary>Temperature Sensor interface</summary>

```json
{
  "@id": "dtmi:azsamples:iotdd:TemperatureSensor;1",
  "@type": "Interface",
  "contents": [
    {
      "@type": "Property",
      "displayName": "Target Temperature",
      "description": "Desired temperature to configure remotely.",
      "name": "targetTemperature",
      "schema": "double",
      "writable": true
    },
    {
      "@type": [
        "Telemetry"
      ],
      "description": "Current temperature on the device",
      "displayName": "Temperature",
      "name": "temperature",
      "schema": "double"
    }
  ]  
}
```

</details>

Users can use IoT Explorer or the CloudApplication to set the TargetTemperature, the device must adapt the current temperature until it reaches the target temperature and then stops sending.

### Device2. Weather Station

This device has two sensors -interior and exterior - implementing the Climate Sensor interface.

- ClimateSensor. Interface reporting different climate related parameters.
  - Temperature, Humidity, Pressure (Telemetry)
  - UpdateInterval. (Writable property)
  - GetClimateSummary (Command to return a complex type with highs, lows, and precipitations )

<details>

<summary>See Climate Sensor interface</summary>

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:azsamples:iotdd:ClimateSensor;1",
  "@type": "Interface",
  "displayName": "Climate Sensor",
  "description": "Provides functionality to report temperature, humidity, Pressure",
  "comment": "Requires temperature, hunidity and pressure sensors.",
  "contents": [
    {
      "@type": "Property",
      "displayName": "Update interval",
      "description": "Interval of telemetry updates in seconds",
      "name": "updateInterval",
      "writable" : true,
      "schema": "integer"
    },
    {
      "@type": [
        "Telemetry",
        "SemanticType/Temperature"
      ],
      "description": "Current temperature on the device",
      "displayName": "Temperature",
      "name": "temperature",
      "schema": "double"
    },
    {
      "@type": [
        "Telemetry",
        "SemanticType/Humidity"
      ],
      "description": "Current humidity on the device",
      "displayName": "Humidity",
      "name": "humidity",
      "schema": "double"
    },
    {
      "@type": [
        "Telemetry",
        "SemanticType/Pressure"
      ],
      "description": "Current Pressure on the device",
      "displayName": "Pressure",
      "name": "pressure",
      "schema": "double"
    },
    {
      "@type": "Command",
      "description": "Get a report with summary values from the past N days.",
      "name": "GetClimateSummary",
      "commandType": "synchronous",
      "request": {
        "name": "numberOfDays",
        "schema": "integer"
      },
      "response": {
        "name": "climateSummaryResponse",
        "schema": {
          "@type": "Object",
          "fields": [
            {
              "name": "SummaryText",
              "schema": "string"
            },
            {
              "name": "highTemp",
              "schema": "double"
            },
            {
              "name": "lowTemp",
              "schema": "double"
            },
            {
              "name": "avgTemp",
              "schema": "double"
            },
            {
              "name": "numberOfSamples",
              "schema": "float"
            }
          ]
        }
      }
    }
  ]  
}
```

</details>

The WeatherStation device implement the next interfaces:

<details>

<summary>WeatherStation model</summary>

```json
{
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:azsamples:iotdd:WeatherStation;1",
  "@type": "Interface",
  "displayName": "Sample Weather Station with interior and exterior sensors",
  "contents": [
    {
      "@type": "Component",
      "schema": "dtmi:azsamples:iotdd:ClimateSensor;1",
      "name": "interior"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azsamples:iotdd:ClimateSensor;1",
      "name": "exterior"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azure:DeviceManagement:DeviceInformation;1",
      "name": "deviceInfo"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azure:Client:SDKInformation;1",
      "name": "sdkInfo"
    },
    {
      "@type": "Component",
      "schema": "dtmi:azsamples:iotdd:Diagnostics;1",
      "name": "diag"
    }
  ]
}
```

</details>

### CloudAplication

This is an application that connects to IoT Hub using the service SDK offering the next features:

- List Devices and Status
- For Each Device:
  - Determine if the device announces a ModelId
  - Resolve the Model contents from the ModelId
    - If it's a known model, show an ad-hoc UI
  - For Models without an ad-hov UI
    - Show a dynamically generated UI
  - Devices without ModelId
    - Show the properties available in the Twin

## SDK support

This release is supported by the next SDK versions

Device SDK

- azure-iot-sdk-c [public-preview-pnp](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp) branch
- azure-iot-sdk-node [public-preview-pnp](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp) branch
- azure-iot-sdk-python [digitaltwins-preview](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview) branch

Service SDK

- azure-iot-sdk-node [public-preview-pnp](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp) branch 

## Scenario Steps

### 1. Create the Thermostat Device simulator

Based on the sample device for [C](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp/digitaltwin_client/samples) or [node](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp/digitaltwins/samples/device), adapt the sample code to implement the Thermostat model.

The device should handle the property update for `targetTemperature` and gradually increase/decrease the value of the telemetry being sent until the targetTemperature is set.

> To connect the device you must create device regsitration in a Hub supporting the May2020 API

Validate the device with Azure IoT Explorer

- Configure IoT Explorer to resolve models from a local folder
- Check the telemetry is coming through
- Check the PnP Components
- Update the targetTemperature property and see how the telemetry changes and stops.
- Call the Reboot command and see the device reacting to that command

#### Things to try

- Add Telemetry properties to the model and device code
- Combine telemetry messages with more than one property
- Add a new command with complex types as input or output parameters
- Update a property when the device is offline and then reconnect the device

### 2. Create the WeatherStation Device simulator

Based on the sample device for [C](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp/digitaltwin_client/samples) or [node](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp/digitaltwins/samples/device), adapt the sample code to implement the WeatherStation model.

- The WeatherStation simulator must use random values to produce temperature/humidity/pressure telemetry
- Handle the `updateInterval` property to change the updateIntervalValue for the telemetry
- The `GetClimateSummary` command will return the highs and lows values for a given period.

> Note the device has two implementations of the same interface.

Validate the device with Azure IoT Explorer

- Configure IoT Explorer to resolve models from a local folder
- Check the telemetry is coming through
- Check the PnP Components
- Update the `updateInterval` property and see how the telemetry frequency changes for each sensor
- Call the `Reboot` command and see the device reacting to that command

#### Things to try

- Add Telemetry properties to the model and device code
- Combine telemetry messages with more than one property
- Add a new command with complex types as input or output parameters
- Try to update a property when the device is offline

### 3. Create the Cloud Application

The cloud application can be any application that connects to the Hub using the service SDKs (or the REST endpoints). This can be a Console, Desktop or WebApplication.

- List Devices. Use the Registry api to get a list of devices
- Detect Model Id. Use the DigitalTwins api to get the ModelId
- Resolve Model. Use the repository API to query for the ModelId
- Ad-Hoc UI. Create a custom UI for known models.
- Dynamic UI. Parse the interface contents to render a UI to interact with the device.

#### Things to try

- Query the Device Twin
- Query the Digital Twin
- Update the ModelId from the device and see the new Id in the DigitalTwin

## Complete Solution

There is a complete solution available here, and you can use it as a reference, but we encourage you to figure out how to complete the scenario steps by using our public documentation and samples.