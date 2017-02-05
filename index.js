var ping = require('ping');
var lirc = require('lirc_node');

var Service, Characteristic;

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-xbox-one-lirc", "Xbox", XboxAccessory);
}

function XboxAccessory(log, config) {
  this.log = log;
  this.name = config['name'] || 'Xbox';
  this.ip = config['ipAddress'];
}

XboxAccessory.prototype = {

  setPowerState: function(powerOn, callback) {
    var self = this;
    
    if (powerOn) {
      lirc.irsend.send_once('XBOX-ONE', 'PowerOn', function() {
        self.log("Sending power on command to '" + this.name + "'...");
      });
    }
    else {
      lirc.irsend.send_once('XBOX-ONE', 'PowerOff', function() {
        self.log("Sending power off command to '" + this.name + "'...");
      });
    }

    // Don't really care about powerOn errors, and don't want more than one callback
    callback();
  },

  getPowerState: function(callback) {
    ping.sys.probe(this.ip, function(isAlive){
      callback(null, isAlive);
    });
  },

  identify: function(callback) {
    this.log("Identify...");
    callback();
  },

  getServices: function() {
    var switchService = new Service.Switch(this.name);

    switchService
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPowerState.bind(this));

    switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerState.bind(this));

    return [switchService];
  }
};
