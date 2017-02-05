# homebridge-xbox-one

Homebridge plugin to manage the power state of an Xbox One using LiRC (IR).

## Installation

You must have a working LiRC configuration. Please see <documentation> for information.
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

On your Xbox, go to Settings > Network > Network Settings > Advanced Settings
