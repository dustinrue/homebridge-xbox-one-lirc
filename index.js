var ping = require('ping');
var lirc = require('lirc_node');
var powerState = 0;

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

function pinger(switchService, xboxAccessory) {
  var self = xboxAccessory;
  
  self.log("Probing " + self.name + " at " + self.ip);
  ping.sys.probe(self.ip, function(isAlive) {
    if (isAlive) {
      self.log(self.name + " is up");
      switchService.getCharacteristic(Characteristic.On).getValue();
    }
    else {
      self.log(self.name + " is down");
      switchService.getCharacteristic(Characteristic.On).getValue();
    }
    powerState = isAlive;
  });
}

XboxAccessory.prototype = {

  setPowerState: function(powerOn, callback) {
    var self = this;
    
    self.log("powerOn value is");
    console.log(powerOn);
    if (powerOn) {
      lirc.irsend.send_once('XBOX-ONE', 'PowerOn', function() {
        self.log("Sending power on command to '" + self.name + "'...");
      });
    }
    else {
      lirc.irsend.send_once('XBOX-ONE', 'PowerOff', function() {
        self.log("Sending power off command to '" + self.name + "'...");
      });
    }

    var checkDelay = (powerOn) ? 8000:15000;

    setTimeout(function() {
      ping.sys.probe(this.ip, function(isAlive){
        if ((isAlive) ? 0:1 == powerOn) {
          self.log("Power toggle worked");
          callback(1);
        }
        else {
          self.log("Power toggle failed");
          callback(0);
        }
        
      });
    }, checkDelay);
    
  },

  getPowerState: function(callback) {
    callback(null, powerState);
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

    var xboxAccessory = this;
    var pingTimer = setInterval(function() {
      pinger(switchService, xboxAccessory);
    }, 1000 * 5);

    return [switchService];
  }
};
