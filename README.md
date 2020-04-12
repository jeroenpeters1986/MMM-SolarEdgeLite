# MMM-SolarEdgeLite
A simple Solar Module for MagicMirror2 designed to integrate with a SolarEdge System

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation
  1. Clone repo into MagicMirror/modules directory
  2. Get a SolarEdge API key and authorize your application (instructions below).
  3. Create an entry in 'config/config.js' with your API Key, SiteID and any config options.

 **Example:**
```
 {
    module: 'MMM-SolarEdgeLite',
	position: 'bottom_left',
	config: {
		apiKey: "################################", //Requires your own API Key
		siteId: "12345", //SolarEdge site ID
        languague: "en",
	}1
 },
```
**Note:** Only enter your API Key in the `config.js` file. Your API Key is yours alone, _do not_ post or use it elsewhere.

## Sample
![alt text](https://github.com/bertieuk/MMM-SolarEdge/blob/master/SolarEdge.png "Example")

## Optional Config
| **Option** | **Description** |
| --- | --- |
| `language` | Currently `en` and `nl` are supported, default is `en` |
| `basicHeader` | Set to `true` to substitute the 'Solar PV' text and graphic for the default MagicMirror header |

## API Key
Use of this module requires
  1. An API Key, which you can obtain by emailing SolarEdge support (e.g support-uk@solaredge.com )
  2. The Site ID of the SolarEdge system you wish to monitor, which can be found in the Dashboard https://monitoring.solaredge.com
