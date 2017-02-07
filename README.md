# homebridge-xbox-one

Homebridge plugin to manage the power state of an Xbox One using LiRC (IR).

## Installation

You must have a working LiRC configuration. Please see [LiRC documentation](lirc.md) for information.
```
npm install -g homebridge-xbox-one-lirc
```

## Configuration

Add this to your `~/.homebridge/config.json` as an accessory:
```
{
  "accessory": "Xbox",
  "name": "Xbox",
  "ipAddress": "<Xbox IP address>"
}
```

## Getting your Xbox One's IP address

This module does it's best to determine if your Xbox One is on or not using a ping request. Because of how the Xbox One is designed it's difficult to reliably determine if it is on or off. If you use standby mode (not power saving mode) your Xbox will wake and appear on the network quite often. 

For it to work at all, I recommend you force your Xbox One to use a static IP (okay) or configure your router (better) to reserve and IP for your Xbox One based on it's MAC address. To get your MAC address or set the IP nn your Xbox, go to Settings > Network > Network Settings > Advanced Settings and configure appropriately. Use this IP in the config as discussed above.
