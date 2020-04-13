# MMM-SolarEdgeLite
A simple solar module for MagicMirror2 designed to integrate with a SolarEdge System

## Dependencies
  * A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/jeroenpeters1986/MMM-SolarEdgeLite.git
````

Now get your SolarEdge API key and authorize your application (instructions below).

Add the module to the modules array in the `config/config.js` file:

```
 {
    module: 'MMM-SolarEdgeLite',
	position: 'middle_center',
	config: {
		apiKey: "################################", // Requires your own API Key
		siteId: "12345", // SolarEdge site ID
		languague: "en"
	}
 },
```
**Note:** Only enter your API Key in the `config.js` file. Your API Key is yours alone, _do not_ post or use it elsewhere.

## Sample
![MMM-SolarEdgeLite module for MagicMirror](https://raw.githubusercontent.com/jeroenpeters1986/MMM-SolarEdgeLite/master/SolarEdgeLite.png "MMM-SolarEdgeLite module for MagicMirror")

## Optional Config
| **Option** | **Description** |
| --- | --- |
| `language` | Currently `en` and `nl` are supported, default is `en` |
| `basicHeader` | Set to `true` to substitute the 'Solar PV' text and graphic for the default MagicMirror header |

## API Key
Use of this module requires
  1. An API Key, which you can obtain by emailing SolarEdge support (e.g support-uk@solaredge.com )
  2. The Site ID of the SolarEdge system you wish to monitor, which can be found in the Dashboard https://monitoring.solaredge.com
