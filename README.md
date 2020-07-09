<!-- markdownlint-disable MD033 -->
# IoT Plug and Play BugBash instructions for the Summer Refresh 2020 release

## Intro

This bug bash is focussed on the new IoT Hub features, SDKs, and tooling for the IoT Plug and Play Summer Refresh 2020 release.

### BugBash support and feedback
- Use the teams channel [PnP Public Preview BugBash](https://teams.microsoft.com/l/channel/19%3a0b9d0f166a3d41c69ce90fcca7631962%40thread.skype/PnP%2520Public%2520Preview?groupId=dcc1ac84-f476-4c96-8034-b2d77e54c8bf&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47) to ask for help. There will be team members answering questions during the BugBash.
- If you have bugs or feature request, please use this [Bug Template](https://msazure.visualstudio.com/One/_workitems/create/Bug?templateId=221e542f-3428-49ba-951b-5ba1dce3f9a9&ownerId=1e65a829-00c0-4dc9-8088-d41678a0d033). You can query existing bugs in this [PnP BugBash Query](https://msazure.visualstudio.com/One/_queries/query-edit/07523176-81f2-4eb3-a795-8a483cd30310/)

### Getting started, environment and tooling
#### IoT Hub
- The required hub version is only available in the canary environment. Either use a Canary enabled subscription to create an IoT Hub or request access to the `IOTPNP_TEST_BY_MAIN` subscription, via the Teams channel mentioned above. 
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

#### Digital Twin Definition Language
The DTDL v2 Spec can be found at [https://aka.ms/dtdl](https://aka.ms/dtdl) can be used as a reference for the language. Use the [samples](https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL/v2/samples) we've provided to get started.

#### PnP related tools
Tools available as internal previews are:

- [IoT Model Repository](https://canary.iotmodels.trafficmanager.net/)
- [Azure IoT Explorer](https://github.com/YingXue/azure-iot-explorer/releases/tag/PnpSummerRefresh-0707)

### Create simulated device and solution from scratch
- Follow the instructions in this [deck](https://microsoft.sharepoint.com/:p:/t/PnPCross-TeamCore/EVKSV21fLY1DpsThEe7BpGAB0ICpX9Fjice0YCGS8JWm_A?e=5aYEQ3) to create your own simulated device and custom solution from scratch.
- The instructions in that deck are specific to C# but can be generalized to the language of your choice as needed.


#### Environment Setup
- Create S1 IoTHub in region ‘Central US EUAP’
- Install VS2019
- Install VS Code (optional, don’t need both)
- DTDL authoring extension (https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl)
- Install IoT Explorer (https://github.com/YingXue/azure-iot-explorer/releases/tag/PnpSummerRefresh-0629)
 
#### IoTHub Configuration
- Under “Built-in endpoints” add a consumer group named “serviceapp”
- Under “Message Routing” add a route with
   - Name=[anything]
   - Endpoint = events
   - Data source = Device Twin Change events
- And another one for Data source = Digital Twin Change events
- Under “IoT devices” create a new device and copy the connection string

### Device Scenarios 
#### Device Application (C#)
- Create a new C# ‘Console App (.NET Core), name it “DeviceApp”
- Go to Tools->Nuget->Package Manager settings
- Add a package source that points to our private bits: https://www.myget.org/F/iot-previews/api/v3/index.json​- - 
- Install ‘Microsoft.Azure.Devices.Client’ package from that source
- Replace Program.cs with the following code:
```
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Shared;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DeviceApp
{
    class Program
    {
        private static string ConnectionString = "TODO: insert your own device connection string here";
        private static string dtmi = "dtmi:contoso:test;1";
        private static DeviceClient deviceClient = null;
        private async static Task Setup()
        {
            // connect to IoT Hub
            ClientOptions options = new ClientOptions() { ModelId = dtmi };
            deviceClient = DeviceClient.CreateFromConnectionString(ConnectionString, TransportType.Mqtt, options);

            // subscribe to commands and updates for writeable properties
            await deviceClient.SetMethodDefaultHandlerAsync(CommandHanlder, null);
            await deviceClient.SetDesiredPropertyUpdateCallbackAsync(PropertyUpdateHandler, null);

            // TODO: once we add read-only properties this would be a good spot to reprt their initial values

            Twin twin = await deviceClient.GetTwinAsync();
            // TODO: once we add writeable properties we need to process any updates here that happened while the device was offline
            return;
        }

        private async static Task Loop()
        {
            while (true)
            {
                // TODO: once we add telemetry this would be a good spot to sent it repeatedly 
                await Task.Delay(3000);
            }
        }

        private static Task<MethodResponse> CommandHanlder(MethodRequest methodRequest, object userContext)
        {
            // once we add Commands, we would handle them here
            throw new NotImplementedException();
        }

        private static Task PropertyUpdateHandler(TwinCollection desiredProperties, object userContext)
        {
            // once we add writeable properties, we would handle any update requests here
            throw new NotImplementedException();
        }

        static async Task Main(string[] args)
        {
            await Setup();
            await Loop();
        }
    }
}

```
- Replace the ConnectionString with yours
- Hit F5 – to launch and connect your empty app to IoTHub

#### Model Creation (device first scenario)
- Open VS Code, hit F1 and select “DTDL: Create Interface”
- Change the model ID to “dtmi:contoso:test;1”
- Inspect the dummy content of the file:
   - Telemetry: temperature (double)
   - Read-only property: deviceStatus (string)
   - Command: reboot (integer request, empty response)
- Let’s add a writeable property:
```
{
  "@type": "Property",
  "name": "customerName",
  "schema": "string",
  "writable": true
}, 
```

#### Configure IoT Explorer
- Home->Add Connection-> enter your IoT Hub connection string (not your device connection string)
- You get that string in the portal under “Shared Access Policies”  ‘iothubowner’
- Under “Plug & Play” settings add the folder where your DTDL file is saved
- Hit F5 in VS and inspect your device in IoT Explorer

#### Implement Read-only Property
```
 TwinCollection reported = new TwinCollection();

 reported["deviceStatus"] = "Happy!";

 await deviceClient.UpdateReportedPropertiesAsync(reported);
```
- Hit F5 and verify in IoT Explorer
- Change “Happy!”  123 (no quotes)
- Hit F5 and verify IoT Explorer flags violation of the model

#### Implement Telemetry
```
var payload = new { temperature = 67.7d };
Message message = new Message(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(payload)));
message.ContentEncoding = "utf-8";
message.ContentType = "application/json";
await deviceClient.SendEventAsync(message);
```
- Hit F5 and verify in IoT Explorer
- Change temperature -> temp 
- Hit F5 and verify IoT Explorer flags violation of the model

#### Implement Command
```
if (methodRequest.Name == "reboot")
{
    string payload = methodRequest.DataAsJson;
    // perform command action
}
```
- Add the above in the CommandHandler function
- Hit F5 and trigger the command from IoT Explorer
- Set a breakpoint to verify correct payload
- Return a response code <> 200 and verify in IoT Explorer
#### Implement Writeable Property
```
if (desiredProperties.Contains("customerName"))
{
    TwinCollection reported = new TwinCollection();
    reported["customerName"] = new
    {
        value = desiredProperties["customerName"],
        ac = 202,
        av = desiredProperties.Version,
        ad = "Completed“
    };
    await deviceClient.UpdateReportedPropertiesAsync(reported);
}
```
- This code needs to be run in the PropertyHandler and on device startup​

#### Add Component
- Add this to your DTDL:
```
 {
   "@type": "Component",
   "name": "MyFirstComponent",
   "schema": "dtmi:contoso:component1;1"
 }
```
- Open VS Code, hit F1 and select “DTDL: Create Interface”
- Change the model ID to “dtmi:contoso:component;1”
- Add a writeable property to the new component
- Hit F5 in VS, reload the device in IoT Explorer to see the component

#### Read-only Property on Component
```
TwinCollection reported = new TwinCollection();
reported["MyFirstComponent"] = new
{
    deviceStatus = "Happy Component!",
    __t = "c"
};
```
- Hit F5 and verify in IoT Explorer
- Change “Happy!”  123 (no quotes)
- Hit F5 and verify IoT Explorer flags violation of the model

#### Telemetry on Component
```
var payload = new { temperature = 67.7d };
Message message = new Message(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(payload)));
message.ContentEncoding = "utf-8";
message.ContentType = "application/json";
message.Properties.Add("$.sub", "MyFirstComponent");
await deviceClient.SendEventAsync(message);
```
- Hit F5 and verify in IoT Explorer
- hange temperature -> temp
- Hit F5 and verify IoT Explorer flags violation of the model

#### Command on Component
```
if (methodRequest.Name == " MyFirstComponent*reboot")
{
    string payload = methodRequest.DataAsJson;
    // perform command action
}
```
- Add the above in the CommandHandler function
- Hit F5 and trigger the command from IoT Explorer
- Set a breakpoint to verify correct payload
- Return a response code <> 200 and verify in IoT Explorer
 
#### Writeable Property on Component
```
if (desiredProperties.Contains("MyFirstComponent"))
{
    JObject desired = desiredProperties["MyFirstComponent"];
    if (desired.ContainsKey("customerName"))
    {
        TwinCollection reported = new TwinCollection();
        var propertyUpdate = new
        {
            customerName = new
            {
                value = desired["customerName"],
                ac = 200,
                av = desiredProperties.Version,
                ad = "Completed "
            },
            __t = "c"
        };
        reported["MyFirstComponent"] = propertyUpdate;
        await deviceClient.UpdateReportedPropertiesAsync(reported);
    }
}
```
- This code needs to be run in the PropertyHandler **and** on device startup

### Solution Scenarios

#### Service Application (C#)
- Create a new C# ‘Console App (.NET Core), name it “ServiceApp”
- Install ‘Microsoft.Azure.Devices.’ package from the private source
- Install ‘Microsoft.Azure.EventHubs’ package from Nuget
- Replace Program.cs with the attached code:

- Replace the connection strings with yours:
```
az iot hub show --query properties.eventHubEndpoints.events.endpoint --name {YourIoTHubName}
az iot hub show --query properties.eventHubEndpoints.events.path --name {YourIoTHubName}
az iot hub policy show --name service --query primaryKey --hub-name {YourIoTHubName}
```
- Hit F5 – to launch and connect your empty app to IoTHub

#### Read Properties (Hub APIs*)
```
var twin = await registryManager.GetTwinAsync("testdevice1");
string modelId = twin.ModelId;
string deviceStatus = twin.Properties.Reported["deviceStatus"];
TwinCollection component = twin.Properties.Reported["MyFirstComponent"];
TwinCollection property =  component["customerName"];
string MyFirstComponent_customerName = property["value"];
```
- We don’t have DT APIs for C# yet. Use Node or Python for doing the same with DT APIs

#### Receive Property Updates
- Set breakpoint in ‘OnDigitalTwinChangedReceived’ and inspect the values
- Set breakpoint in ‘OnDeviceTwinChangedReceived’ and compare

#### Receive Telemetry
- Set breakpoint in ‘OnTelemetryReceived’ and inspect the values

#### Invoke Commands (Hub APIs*)​
```
CloudToDeviceMethod method = new CloudToDeviceMethod("reboot");
method.SetPayloadJson("{ \"delay\": 42 }");
await serviceClient.InvokeDeviceMethodAsync(DeviceId, method);
```
```
CloudToDeviceMethod method = new CloudToDeviceMethod(" MyFirstComponent*reboot");
method.SetPayloadJson("{ \"delay\": 42 }");
await serviceClient.InvokeDeviceMethodAsync(DeviceId, method);
```
- We don’t have DT APIs for C# yet. Use Node or Python for doing the same with DT APIs 

#### Update Writeable Properties (Hub APIs*)
```
Twin twin = await registryManager.GetTwinAsync(DeviceId);
var patch = new {
    properties = new {
        desired = new {
            customerName = "Siemens",
        }
    }
};

Twin newtwin =
  await registryManager.UpdateTwinAsync(
    DeviceId, JsonConvert.SerializeObject(patch), twin.ETag);
```
- We don’t have DT APIs for C# yet. Use Node or Python for doing the same with DT APIs

#### Update Writeable Properties (Hub APIs*)
```
Twin twin = await registryManager.GetTwinAsync(DeviceId);
var patch = new {
    properties = new {
        desired = new {
            MyFirstComponent = new {
                customerName = "Siemens",
                __t = "c "
            }
        }
    }
};

Twin newtwin = await registryManager.UpdateTwinAsync(DeviceId, JsonConvert.SerializeObject(patch), twin.ETag);
```
- We don’t have DT APIs for C# yet. Use Node or Python for doing the same with DT APIs

#### Using the Model Parser
- Add Reference to ‘Microsoft.Azure.DigitalTwins.Parser’ (from Nuget)
```
string modelContent = File.ReadAllText(modelFilePath);
ModelParser parser = new ModelParser();
parser.DtmiResolver = new DtmiResolver(DtmiResolverCallback);
var parseResults = await parser.ParseAsync(new string[] { modelContent });
```

private static Task<IEnumerable<string>> DtmiResolverCallback(IReadOnlyCollection<Dtmi> dtmis)
{
    // resolve model in multi-component scenarios
}
```


