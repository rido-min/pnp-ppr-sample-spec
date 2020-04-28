# Plug and Play samples spec for May 2020 release

> This spec describes the e2e sample we will use for the next BugBash, and eventually will be published as a tutorial in docs.ms.com.

## Intro

PnP is a set of technologies designed to make it easier to build IoT Solutions based on Azure IoT Hub. To address the needs for device and cloud developers the tutorial must target both.

Devices connected to IoT Hub can de described with DTDL, in terms of:

- Properties (Available trough Twins)
- Commands (Using the Hub Direct Methods feature)
- Telemetry (processed through EventHub)

### Bug Bash notes

For a BugBash, the instructions should not duplicate content already  available like READMEs or Docs, instead the instructions should help to find information that is not easy to find (not yet indexed, not available publicily, etc.. )

Each section in the Bug Bash can have 3 different activities targeting different levels of complexity:

1. **Basic**. These are the minimal instructions to complete the scenario. This is the _happy path_ and should be easy to complete. Eg. Send temperature
2. **Intermediate**. Offer additional activities to explore the feature in depth. Eg. Use different semantic data types.
3. **Advanced**. Additional activites that will stress the feature being evaluated. Eg. Create telemetry using complex object types.

## Sample Solution  Features

The solution include 2 devices connected to Azure IoT using Central (SaaS) or Hub (PaaS). For Hub a Cloud Application will be required.

All devices must implement the next interfaces:

- DeviceInformation (Common)
- SDKInformation (Common)
- Diagnostics (Custom)

### Device1. Thermostat

This device simulates a temperature sensor

- Thermostat.model.json
  - TemperatureSensor.interface.json
    - Temperature (Telemetry)
      - TargetTemperature (Writable Property)
  - DeviceInfo.interface.json
  - SdkInfo.interface.json
  - Diagnostics.interface.json

Users can use the CloudApplication to set the TargetTemperature, the device must adapt the current temperature until it reaches the target temperature.

### Device2. Weather Station

This device has two sensors -interior and exterior - implementing the Climate Sensor interface.

- ClimateSensor. Interface reporting different climate related parameters.
  - Temperature, Humidity, Pressure (Telemetry)
  - UpdateInterval. (Writable property)
  - GetClimateSummary (Command to return a complex type with highs, lows, and precipitations )

- Weather Station
  - ClimateSensor.interface.json
  - DeviceInfo.interface.json
  - SdkInfo.interface.json
  - Diagnostics.interface.json

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

Service SDK

- azure-iot-sdk-node [public-preview-pnp](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp) branch 

## Scenario Steps

### 1. Create the Thermostat Device simulator

Based on the sample device for [C](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp/digitaltwin_client/samples) or [node](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp/digitaltwins/samples/device), adapt the sample code to implement the Thermostat model.

The device should handle the property update for `targetTemperature` and gradually increase/decrease the value of the telemetry being sent until the targetTemperature is set.

Validate the device with Azure IoT Explorer

- Check the telemetry is coming through
- Check the PnP Components
- Update the targetTemperature property and see how the telemetry changes and stops.
- Call the Reboot command and see the device reacting to that command

#### Things to try

- Add Telemetry properties to the model and device code, combine telemetry messages with more than one property
- Add a new command with complex types as input or output parameters
- Try to update a property when the device is offline

### 2. Create the WeatherStation Device simulator

Based on the sample device for [C](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp/digitaltwin_client/samples) or [node](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp/digitaltwins/samples/device), adapt the sample code to implement the WeatherStation model.

The WeatherStation simulator must use random values to produce temperature/humidity/pressure telemetry
Handle the `updateInterval` property to change the updateIntervalValue for the telemetry
The `GetClimateSummary` command will return the highs and lows values for a given period.

Note the device has two implementations of the same interface.

Validate the device with Azure IoT Explorer

- Check the telemetry is coming through
- Check the PnP Components
- Update the `updateInterval` property and see how the telemetry frequency changes for each sensor
- Call the `Reboot` command and see the device reacting to that command

#### Things to try

- Add Telemetry properties to the model and device code, combine telemetry messages with more than one property
- Add a new command with complex types as input or output parameters
- Try to update a property when the device is offline
