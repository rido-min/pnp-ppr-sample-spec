<!-- markdownlint-disable MD033 -->
# Plug and Play samples spec for May 2020 release

> This spec describes the e2e sample we will use for the next BugBash, and eventually will be published as a tutorial in docs.ms.com.

## Intro

PnP is a set of technologies designed to make it easier to build IoT Solutions based on Azure IoT Hub. To address the needs for device and cloud developers the tutorial must target both.

Devices connected to IoT Hub can de described with DTDL, in terms of:

- Properties (Available trough Twins)
- Commands (Using the Hub Direct Methods feature)
- Telemetry (processed through EventHub)

Review the docs [IoT Plug and Play Preview Documentation](https://review.docs.microsoft.com/azure/iot-pnp/?branch=release-preview-refresh-iot-pnp).

### Private environments, and preview SDKs

As the time of writing the version of IoT Hub supporting PnP BugBash 2, 08 May2020 release is only deployed to a private hub instance:

```js
<Connection Strings for IoT Hub>
```

#### SDK support

This release is supported by the next SDK versions

Device SDK

- azure-iot-sdk-c [public-preview-pnp](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp) branch
- azure-iot-sdk-node [public-preview-pnp](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp) branch
- azure-iot-sdk-python [digitaltwins-preview](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview) branch

Service SDK

- azure-iot-sdk-node [public-preview-pnp](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp) branch
- azure-iot-sdk-python [digitaltwins-preview](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview) branch

#### PnP related tools

The tools are available as internal previews:

- Azure IoT Explorer (available as private release in [YingXue/azure-iot-explorer/releases](https://github.com/YingXue/azure-iot-explorer/releases) )
- VSCode extension for DTDL (availabe as a private release in [microsoft/vscode-azure-digital-twins/releases](https://github.com/microsoft/vscode-azure-digital-twins/releases) ). To install, download the `.vsix` file and install in VSCode as decribed [here](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix).
- [IoT Model Repository](https://test.iotmodels.trafficmanager.net/)

## Sample Solution  Features

The solution to build includes 1 device connected to Azure IoT using Central (SaaS) or Hub (PaaS).

>Note: SaaS solutions require to configure the Central application creating device templates based on the DTDL models. Central does not supoprt DTLD v2. It's out of scope for this BugBash.

PaaS solutions require some kind of computing resource to connect to the service endpoints, usually REST, by using the Service Client SDKs.

This BugBash uses the following Models to describe the devices features to implement.

We we'll use two common interfaces:

- [DeviceInformation](./models/DeviceInformation.json) (Common)
- [SDKInformation](./models/SDKInformation.json) (Common)

And a custom interface to monitor the memory and enable reboots:

- [Diagnostics](./models/Diagnostics.json) (Custom)

### Thermostat Device

This device simulates a temperature sensor, and uses the next interfaces:

<details>

<summary>Thermostat model</summary>

```json
{
  "@id": "dtmi:com:example:Thermostat;1",
  "@type": "Interface",
  "contents": [
    {
      "@type": "Component",
      "schema": "dtmi:com:example:TemperatureSensor;1",
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
      "schema": "dtmi:com:example:diagnostics;1",
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
  "@context": "dtmi:dtdl:context;2",
  "@id": "dtmi:com:example:TemperatureSensor;1",
  "@type": "Interface",
  "displayName": "Temperature Sensor",
  "description": "Provides functionality to report temperature, and write property to set the target Temperature",
  "comment": "Requires temperature sensors.",
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
      "@type": "Property",
      "displayName": "Current Temperature",
      "description": "Current temperature reported from the device.",
      "name": "currentTemperature",
      "schema": "double",
      "writable": false
    },
    {
      "@type": [
        "Telemetry",
        "Temperature"
      ],
      "description": "Current temperature on the device",
      "displayName": "Temperature",
      "name": "temperature",
      "schema": "double",
      "unit": "degreeCelsius"
    }
  ]
}
```

</details>

The device must adapt the current temperature until it reaches the target, during the process the current temperature should be reported via telemetry and updating the currentTemperature property.

Users can use IoT Explorer or the CloudApplication to update the TargetTemperature and see how the device reacts to the change.

### CloudAplication

This is an application that connects to IoT Hub using the service SDK offering the next features:

- List Devices and Status
- For Each Device:
  - Determine if the device announces a ModelId
  - Resolve the Model contents from the ModelId
    - If it's a known model, show an ad-hoc UI
  - For Models without an ad-hoc UI
    - Show a dynamically generated UI
  - Devices without ModelId
    - Show the properties available in the Twin

## Scenario Steps

### 1. Review the existing samples

Follow the tutorial [Quickstart: Connect a sample IoT Plug and Play Preview device application running on Linux or Windows to IoT Hub (C)](https://review.docs.microsoft.com/azure/iot-pnp/quickstart-connect-device-c?branch=release-preview-refresh-iot-pnp) to build and run the existing [C device sample](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp/digitaltwin_client/samples)

Follow the tutorial [Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub (Node.js)](https://review.docs.microsoft.com/azure/iot-pnp/quickstart-connect-device-node?branch=release-preview-refresh-iot-pnp) to build and run the existing [node device sample](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp/digitaltwins/samples/device/javascript)

Follow the tutorial [Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub (Python)](https://review.docs.microsoft.com/azure/iot-pnp/quickstart-connect-device-python?branch=release-preview-refresh-iot-pnp) to build and run the existing [Python device sample](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview/azure-iot-device/samples/pnp)

Follow the how to article [HOW-to guides: Manage Models in the repository](https://review.docs.microsoft.com/azure/iot-pnp/howto-manage-models?branch=pr-en-us-114283) to create, publish, share models and manage access.

#### Interact with the devices using IoT Explorer

1. Create a new hub instance following the instructions to use the canary environment (TBD)
2. Install the private version of IoT Explorer
3. Create a device registration in IoT explorer and get the device connection string.
4. Use the connection string to connect the sample devices to hub
5. IoT Explorer should show the `IoT Plug and Play components` tab
6. Configure IoT Explorer to load the models from a local folder
7. Inspect Telemetry, Update properties and invoke commands from IoT Explorer

>Note: These steps are valid to validate any PnP device

### 2. Create the Thermostat Device simulator

Based on the existing samples, create a new device to implement the [Themorstat Model](./models/Thermostat.json).

The device should handle the property update for `targetTemperature` and gradually increase/decrease the value of the telemetry being sent until the targetTemperature is set.

Validate the device with Azure IoT Explorer

#### Things to try in the device app

- Add Telemetry properties to the model and device code
- Combine telemetry messages with more than one property
- Add a new command with complex types as input or output parameters
- Update a property when the device is offline and verify it's applied when the device reconnects.

### 3. Create the Cloud Application

The cloud application can be any application that connects to the Hub using the service SDKs (or the REST endpoints). This can be a Console, Desktop or WebApplication.

- List Devices. Use the Registry api to get a list of devices
- Detect Model Id. Use the DigitalTwins api to get the ModelId
- Resolve Model. Use the repository API to query for the ModelId
- Ad-Hoc UI. Create a custom UI for known models.
- Dynamic UI. Parse the interface contents to render a UI to interact with the device.

#### Things to try in the service app

- Query the Device Twin
- Query the Digital Twin
- Update the ModelId from the device and see the new Id in the DigitalTwin
- Update a desired property
- Invoke a command

### 4. IoT Model Repository

In the IoT Model Repository portal you can view and manage public and unpublished models. Admins can also manage the access for users.

- View models
- Create a model
- Share a model
- Publish a model
- Manage user access

#### Things to try

- Create your own AAD tenant by following the instructions [here](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant) and add a user to that tenant. Login with the user in the model repo portal where you will see yourself as first tenant admin.
- Try manage models and user access with your own tenant following the same steps in the howto-manamge-models article.

## Complete Solution

There is a complete solution available here, and you can use it as a reference, but we encourage you to figure out how to complete the scenario steps by using our public documentation and samples.
