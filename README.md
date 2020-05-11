<!-- markdownlint-disable MD033 -->
# Plug and Play BugBash instructions for May2020 release

## Intro

This internal bug bash explores the new IoT Hub features to support the Plug and Play May 2020 release. Using a  DTDL v2 Model to describe a device with one  sensor interface that sends telemetry, accepts commands and reports properties. The sample is based on a device simulator connected to IoT Hub with a client SDK and can be managed using the service SDKs  to read telemetry and interact with properties and commands.

Review the docs in the private staging environment [IoT Plug and Play Preview Documentation](https://review.docs.microsoft.com/azure/iot-pnp/?branch=pr-en-us-114283)

The [DTDL v2 Spec](https://microsoft.sharepoint.com/:w:/t/Azure_IoT/IoTPlat/EaotICYXiQVOh_xnBggJwqMBMKGoOyMzV1qFYsOdcyvOVw?e=VyG0QN) can be used as a reference for the language. An easiest way to get started with the language is by looking at the [sample models](./models) created for this Bug Bash.

### BugBash support and feedback

- Use the teams channel [PnP Public Preview BugBash](https://teams.microsoft.com/l/channel/19%3a0b9d0f166a3d41c69ce90fcca7631962%40thread.skype/PnP%2520Public%2520Preview?groupId=dcc1ac84-f476-4c96-8034-b2d77e54c8bf&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47) to ask for help. There will be team members answering questions during the BugBash.
- If you have bugs or feature request, please use this [Bug Template](https://msazure.visualstudio.com/One/_workitems/create/Bug?templateId=a05dbe62-eb63-4028-9ce0-252c552872f3&ownerId=1e65a829-00c0-4dc9-8088-d41678a0d033). You can query existing bugs in this [PnP BugBash Query](https://msazure.visualstudio.com/One/_queries/query-edit/71cca2fe-63bd-4916-84f6-937f0dfaa698/?action=new)
- For feedback related to the docs use this [azure docs PR](https://github.com/MicrosoftDocs/azure-docs-pr/pull/114283)

## Required environments, SDKs and tools

### IoT Hub

The required hub version is only  available in the canary environment, to create a new hub you can follow the instructions from the docs but using the **subscription** and **regions** described below:

- Request access to the `IOTPNP_TEST_BY_MAIN` subscription, via the Teams channel
- Create a new IoT Hub under this subscription, wihtin the resource group `BugBash` in one of the supported regions: `Central US EUAP` or `East US EUAP`

To create the hub using the `az` CLI replace the hubname and run the script below:

```bash
az extension add --name azure-iot
az login
az account set -s IOTPNP_TEST_BY_MAIN
az az iot hub create --name <alias-hub-name> --resource-group BugBash
```

To create the hub from the portal make sure you select the right subscription, region and resource group.

> Note. Make sure you get the IoT Hub connection string to be able to configure IoT explorer.

#### SDK support

This release is supported by the next SDK versions

##### Device SDK

- azure-iot-sdk-c [public-preview-pnp](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp) branch
- NPM package for node [azure-iot-digitaltwins-device@1.0.0-pnp-refresh.0](https://www.npmjs.com/package/azure-iot-digitaltwins-device/v/1.0.0-pnp-refresh.0)
- Python [Python Device SDK for the BugBash](https://aka.ms/PythonDevicePnP0508) 

##### Service SDK

- NPM package for node [azure-iot-digitaltwins-service@1.0.0-pnp-refresh.0](https://www.npmjs.com/package/azure-iot-digitaltwins-service/v/1.0.0-pnp-refresh.0)
- Python [Python Service SDK for the BugBash](https://aka.ms/PythonServicePnP0508)

#### PnP related tools

The tools are available as internal previews:

- [IoT Model Repository](https://test.iotmodels.trafficmanager.net/)
- Azure IoT Explorer (available as private release in [YingXue/azure-iot-explorer/releases](https://github.com/YingXue/azure-iot-explorer/releases) )
- VSCode extension for DTDL (availabe as a private release in the Marketplace as[VDT Project for RC](https://marketplace.visualstudio.com/items?itemName=IoTDevExBuild.test-vdt-project) ).

>Note: The VSCode extension does not support semantic types in this release. Any semantic type will be ignored (not validated) and there is no intellisense support for these types.

## Sample Solution  Features

The solution to build includes 1 device connected to Azure IoT Hub and a server side application that can interact with the devices using the IoT Hub server APIs.

>Note: Central does not supoprt DTLD v2. It's out of scope for this BugBash.

PaaS solutions require some kind of computing resource to connect to the service REST endpoints by using the Service Client SDKs.

This BugBash uses the following Models to describe the device capabilities.

We we'll use two common interfaces:

- [DeviceInformation](./models/DeviceInformation.json) (Common)
- [SDKInformation](./models/SDKInformation.json) (Common)

And a custom interface to monitor the memory and enable reboots:

- [Diagnostics](./models/Diagnostics.json) (Custom)

### Thermostat Device

This device implements the Thermostat model that is composed by 4 interfaces, one of which is the TemperatureSensor.

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

### 1. Review the existing samples and docs

If you need to learn basic PnP concepts take a minute to familiarize yourself by reading the staging docs available in [review.docs.microsoft.com/azure/iot-pnp](https://review.docs.microsoft.com/azure/iot-pnp?branch=pr-en-us-114283)

To learn how to create a PnP device we have tutorials for C, Node and Python:

- Follow the tutorial [Quickstart: Connect a sample IoT Plug and Play Preview device application running on Linux or Windows to IoT Hub (C)](https://review.docs.microsoft.com/azure/iot-pnp/quickstart-connect-device-c?branch=pr-en-us-114283) to build and run the existing [C device sample](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview-pnp/digitaltwin_client/samples)

- Follow the tutorial [Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub (Node.js)](https://review.docs.microsoft.com/azure/iot-pnp/quickstart-connect-device-node?branch=pr-en-us-114283) to build and run the existing [node device sample](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp/digitaltwins/samples/device/javascript)

- Follow the tutorial [Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub (Python)](https://review.docs.microsoft.com/azure/iot-pnp/quickstart-connect-device-python?branch=pr-en-us-114283) to build and run the existing [Python device sample](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview/azure-iot-device/samples/pnp)

- Follow the howto article [HOW-to guides: Manage Models in the repository](https://review.docs.microsoft.com/azure/iot-pnp/howto-manage-models?branch=pr-en-us-114283) to create, publish, share models and manage access.

#### Interact with the devices using IoT Explorer

1. Create a new hub instance following the instructions to use the canary environment
2. Install the private version of IoT Explorer
3. Create a device registration in IoT explorer and get the device connection string.
4. Use the connection string to connect the sample devices to hub
5. IoT Explorer should show the `IoT Plug and Play components` tab
6. Configure IoT Explorer to load the models from a local folder
7. Inspect Telemetry, Update properties and invoke commands from IoT Explorer

>Note: These steps are valid to validate any PnP device

### 2. Create the Thermostat Device simulator

Based on the existing samples, create a new device to implement the [Themorstat Model](./models/Thermostat.json).

The device should implement the next interfaces:

- Update reported properties in `DeviceInformation` and `SDKInformation` (you can reuse the existing implementations from the samples)
- Handle the `reboot` command and send the `workingset` as telemetry in the `Diagnostics` interface
- Handle desired `targetTemperature` property updates in the `Temperature Sensor` interface and gradually increase/decrease the value of the `currentTemperature`
- Send the `temperature` telemetry message

Validate the device with Azure IoT Explorer.

>Note: You dont need to complete all the interfaces to start the validation, IoT Explorer can help to validate properties, telemetry or commands one at a time.

#### Things to try in the device app

- Edit the model with the VSCode extension and verify how the systax is validated
- Implement a device simulator in C, Python or node to match the model interfaces provided in [`Thermostat.json`](./models/Thermostat.json)
- Combine telemetry messages with more than one property
- Add a new command with complex types as input or output parameters
- Update a property when the device is offline and verify it's applied when the device reconnects.
- Evaluate error messages when the property names do not match the names in the model.

### 3. Create the Cloud Application

The cloud application can be any application that connects to the Hub using the service SDKs (or the REST endpoints). This can be a Console, Desktop or WebApplication.

- Detect Model Id. Use the DigitalTwins api to get the ModelId
- Interact with the device by updating the `targetTemperature` property and invoking the `reboot` command
- Resolve Model. Use the repository API to query for the ModelId of a given device
- Ad-Hoc UI. Create a custom UI for known models.
- Dynamic UI. Parse the interface contents to render a UI to interact with the device.

#### Things to try in the service app

- Query the Device Twin and  the Digital Twin and observe the differences
- Update the ModelId from the device and see the updated value in the DigitalTwin
- Evaluate error messages when the values used to query the twin are not correct

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
