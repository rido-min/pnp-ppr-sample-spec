<!-- markdownlint-disable MD033 -->
# Plug and Play BugBash instructions for the Summer Refresh 2020 release

## Intro

This bug bash is focussed on the new IoT Hub features, SDKs, and tooling for the Plug and Play Summer Refresh 2020 release. There are two options during this bug bash. 

Option 1 is to follow Quickstarts in the Plug and Play documentation to build the samples provided there and run them against the IoT Explorer, a tool we're providing with this release. 

Option 2 is to use a set of intructions we're providing to build a simulated Plug and Play device and a solution to validate the workflow end to end.

The [DTDL v2 Spec](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) can be used as a reference for the language. Use the [samples](https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL/v2/samples) we've provided to get started.

### BugBash support and feedback
- Use the teams channel [PnP Public Preview BugBash](https://teams.microsoft.com/l/channel/19%3a0b9d0f166a3d41c69ce90fcca7631962%40thread.skype/PnP%2520Public%2520Preview?groupId=dcc1ac84-f476-4c96-8034-b2d77e54c8bf&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47) to ask for help. There will be team members answering questions during the BugBash.
- If you have bugs or feature request, please use this [Bug Template](https://msazure.visualstudio.com/One/_workitems/create/Bug?templateId=221e542f-3428-49ba-951b-5ba1dce3f9a9&ownerId=1e65a829-00c0-4dc9-8088-d41678a0d033). You can query existing bugs in this [PnP BugBash Query](https://msazure.visualstudio.com/One/_queries/query-edit/07523176-81f2-4eb3-a795-8a483cd30310/)

### Getting started, environment and tooling
#### IoT Hub
- The required hub version is only available in the canary environment. To get started request access to the `IOTPNP_TEST_BY_MAIN` subscription, via the Teams channel mentioned above. 
- Create S1 IoTHub in region ‘Central US EUAP’. 
>NOTE: All hubs created in this subscription will be removed after the bug bash.

To create the hub using the `az` CLI replace the hubname and run the script below:

```bash
az extension add --name azure-iot
az login
az account set -s IOTPNP_TEST_BY_MAIN
az iot hub create --resource-group BugBash --sku S1 --location centraluseuap --partition-count 4 --name <alias-hub-name>
```

To create the hub from the portal make sure you select the right subscription, region and resource group.

> Note. Make sure you get the IoT Hub connection string to be able to configure IoT explorer.

#### PnP related tools
Tools available as internal previews are:

- [IoT Model Repository](https://canary.iotmodels.trafficmanager.net/)
- [Azure IoT Explorer](https://github.com/YingXue/azure-iot-explorer/releases/tag/PnpSummerRefresh-0707)

### Option 1: Quickstarts
- Start with the Quickstarts in docs stood up in the private staging environment [IoT Plug and Play Preview Documentation](TBD) and follow the instructions there to build your samples.
- Install IoT Explorer from the link provided above.

### Option 2: Simulated device and solution from scratch
- Follow the instructions in this [deck](https://microsoft-my.sharepoint.com/:p:/r/personal/swick_microsoft_com/_layouts/15/guestaccess.aspx?e=5TENW3&CID=D598E8FF-134B-4E1E-98B5-A295AB951D6F&wdLOR=cEE030532-F985-497C-A6E2-43B70C0FC2F9&share=ESNeSZEdc51Fsn2cYWZ4Zs4BpPLICGw8rwLkbtNtxWNWDA) to create your own simulated device and custom solution from scratch.
- The instructions in that deck are specific to C# but can be generalized to the language of your choice as needed.
