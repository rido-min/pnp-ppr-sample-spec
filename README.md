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

This device simulates a thermostat with the next characteristics.

- Temperature (Telemetry)
- TargetTemperature (Writable Property)

Users can use the CloudApplication to set the TargetTemperature, the device must adapt the current temperature until it reaches the target temperature.

### Device2. Weather Station

This device has the next sensors attached to it:

- ClimateSensor. Interface reporting different climate related parameters.
  - Temperature, Humidity, Pressure (Telemetry)
  - UpdateInterval. (Writable property)
  - GetClimateSummary (Command to return a complex type with highs, lows, and precipitations )

### Sample Models/Interfaces

- Thermostat.Device.json
  - TempSensor 



## SDK support

## Developer Experiece

## Next Steps