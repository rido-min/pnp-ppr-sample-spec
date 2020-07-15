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

- The required hub version is only available in the following regions: canary (EastUS2EUAP, CentralUSEUAP) and production (Japan East, Central US and North Europe). For Canary either use a Canary enabled subscription to create an IoT Hub or request access to the `IOTPNP_TEST_BY_MAIN` subscription, via the Teams channel mentioned above.
- Create S1 IoTHub in any of these regions to get started.
- Use the latest API version: 2020-05-31-preview

>NOTE: All hubs created in the `IOTPNP_TEST_BY_MAIN` subscription will be removed after the bug bash. We recommend using your own subscription if you'd want to keep using your IoT Hub long term.

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
4. Note that all the sample code are in the branch **pnp-preview-refresh** in each repo.

You can test the 5 quickstart with component-less Device SDK  (C, C#, Java, Node, Python)
You can test the 2 quiclstart with Service SDK (Node, Python)
You cam also test the 5 Tutorial with multi component devices (C#, Java, Node, Python)

All quickstarts and tutorials are in the [IoT Plug and Play documentation](https://review.docs.microsoft.com/azure/iot-pnp/?branch=pr-en-us-121912)

### Option 2. Exploratory testing

Create simulated device and solution from scratch

- Follow the instructions in this [deck](https://microsoft.sharepoint.com/:p:/t/PnPCross-TeamCore/Ed9pGHB_AaxIgisKioEHSygB2mADMo2vPSQJZK0lKBnFKQ?e=VZ1ztQ) to create your own simulated device and custom solution from scratch.
- The instructions in that deck are specific to C# but can be generalized to the language of your choice as needed.
