<!-- markdownlint-disable MD033 -->
# IoT Plug and Play Samples Bug Bash instructions for the Summer Refresh 2020 release

## Intro

IoT Plug and Play Summer Refresh is the Public Preview Refresh leading upto GA later this year.

This bug bash is focused on the new IoT Hub features, SDKs, and tooling. We have quickstarts in various languages ready, for device and service scenarios - with more languages and advanced tutorials coming soon.

### BugBash support and feedback

- Use the teams channel [PnP Public Preview BugBash](https://teams.microsoft.com/l/channel/19%3a0b9d0f166a3d41c69ce90fcca7631962%40thread.skype/PnP%2520Public%2520Preview?groupId=dcc1ac84-f476-4c96-8034-b2d77e54c8bf&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47) to ask for help. There will be team members answering questions during the BugBash.
- If you have bugs or feature request, please use this [Bug Template](https://msazure.visualstudio.com/One/_workitems/create/Bug?templateId=221e542f-3428-49ba-951b-5ba1dce3f9a9&ownerId=1e65a829-00c0-4dc9-8088-d41678a0d033). You can query existing bugs in this [PnP BugBash Query](https://msazure.visualstudio.com/One/_queries/query-edit/07523176-81f2-4eb3-a795-8a483cd30310/)

### Getting started, environment and tooling

#### Docs

- The pnp docs are available in the staging URL: [IoT Plug and Play documentation](https://review.docs.microsoft.com/azure/iot-pnp/?branch=pr-en-us-121912). To provide feedback use this [PR in docs](https://github.com/MicrosoftDocs/azure-docs-pr/pull/121912), your github account must be registered in the MicrosoftDocs org.

> Not all the articles have been updated, please do not provide feedback on articles not updated in July.

#### IoT Hub

- The required hub version is only available in the canary environment. Either use a Canary enabled subscription to create an IoT Hub or request access to the `IOTPNP_TEST_BY_MAIN` subscription, via the Teams channel mentioned above.
- Create S1 IoTHub in region ‘east us 2 euap’.

>NOTE: All hubs created in this subscription will be removed after the bug bash.

To create the hub using the `az` CLI replace the hubname and run the script below:

```bash
az extension add --name azure-iot
az login
az account set -s IOTPNP_TEST_BY_MAIN
az iot hub create --resource-group BugBash --sku S1 --location eastus2euap --partition-count 4 --name <alias-hub-name>
```

To create the hub from the portal make sure you select the right subscription, region and resource group.

> Note. Make sure you get the IoT Hub connection string to be able to configure IoT explorer.

#### Digital Twin Definition Language

The DTDL v2 Spec can be found at [https://aka.ms/dtdl](https://aka.ms/dtdl) can be used as a reference for the language. Use the [samples](https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL/v2/samples) we've provided to get started.

- [DTDL VS Code extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl)
- [DTDL VS 2019 extension](https://github.com/rido-min/pnp-summer-bugbash/releases/tag/1)

#### PnP related tools

Tools available as internal previews are:

- [IoT Model Repository](https://canary.iotmodels.trafficmanager.net/)
- [Azure IoT Explorer](https://github.com/YingXue/azure-iot-explorer/releases/tag/PnpSummerRefresh-0709) (use bugbash.Azure.IoT.Explorer.preview.0.11.1.msi
)

### Option 1. Review and run SDK samples

All samples implement the Themorstat and TemperatureController models available in the [DTDL spec repo](https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL/v2/samples), and use the same validation flow:

1. Prepare source code for each language.
2. Create a device and provide the connection string.
3. Configure IoT Explorer to find the models and to interact with the device.

#### C-SDK

- **pnp_simple_thermostat** This sample implements a model with a single interface. This [Quickstart](https://review.docs.microsoft.com/en-us/azure/iot-pnp/quickstart-connect-device-c?branch=pr-en-us-121912) has instructions to configure the [pnp_simple_thermostat](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/pnp/pnp_simple_thermostat) sample.

#### Node.js

- **simple_thermostat.js** This sample implements a model with a single interface. This [Quickstart](https://review.docs.microsoft.com/en-us/azure/iot-pnp/quickstart-connect-device-node?branch=pr-en-us-121912) has instructions to configure the [simple thermostat.js](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/pnp/simple_thermostat.js)
- **pnpTemperatureController** This sample implements a model with two interfaces using components. The doc is not ready, but instructions are similar to the simple_thermostat, [pnpTemperatureController.js](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/pnp/pnpTemperatureController.js)

- **Service sample** These samples exercise the service side features. This [Quickstart](https://review.docs.microsoft.com/en-us/azure/iot-pnp/quickstart-service-node?branch=pr-en-us-121912) has instructions run the [node service samples](https://github.com/Azure/azure-iot-sdk-node/tree/public-preview-pnp/digitaltwins/samples/service/javascript)  

#### CSharp

- **simple_thermostat** This sample implements a model with a single interface. This [Quickstart](https://review.docs.microsoft.com/en-us/azure/iot-pnp/quickstart-connect-device-csharp?branch=pr-en-us-121912) has instructions to configure the [simple_thermostat](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/device/samples/PnpDeviceSamples/Thermostat)
- **pnpTemperatureController** This sample implements a model with two interfaces using components. This [Quickstart](https://review.docs.microsoft.com/en-us/azure/iot-pnp/tutorial-multiple-components-csharp?branch=pr-en-us-121912) has instructions to configure the [temperaturecontroller](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/iothub/device/samples/PnpDeviceSamples/TemperatureController)

#### Python

- **simple_thermostat** This sample implements a model with a single interface. This [Quickstart](https://review.docs.microsoft.com/en-us/azure/iot-pnp/quickstart-connect-device-python?branch=pr-en-us-121912) has instructions to configure the [simple_thermostat](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-device/samples/pnp/pnp_thermostat.py)
- **pnpTemperatureController** This sample implements a model with two interfaces using components. This [Quickstart](https://review.docs.microsoft.com/en-us/azure/iot-pnp/tutorial-multiple-components-python?branch=pr-en-us-121912) has instructions to configure the [temperaturecontroller](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-device/samples/pnp/pnp_temp_controller_with_thermostats.py)

- **Service sample** These samples experiment the featire on the service side. This [Quickstart in PR](https://github.com/MicrosoftDocs/azure-docs-pr/pull/121761) has instructions run the [python service samples](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview/azure-iot-hub/samples)  

### Option 2. Exploratory testing

Create simulated device and solution from scratch

- Follow the instructions in this [deck](https://microsoft.sharepoint.com/:p:/t/PnPCross-TeamCore/Ed9pGHB_AaxIgisKioEHSygB2mADMo2vPSQJZK0lKBnFKQ?e=VZ1ztQ) to create your own simulated device and custom solution from scratch.
- The instructions in that deck are specific to C# but can be generalized to the language of your choice as needed.
