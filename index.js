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
  var xboxAccessoryObject = this;
  var pingTimer = setInterval(function() {
    pinger(xboxAccessoryObject);
  }, 1000 * 5);
}

function pinger(object) {
  var self = object;
  self.log("Probing " + self.name + " at " + self.ip);
  ping.sys.probe(self.ip, function(isAlive) {
    if (isAlive) {
      self.log(self.name + " is up");
      XboxAccessory.prototype.getCharacteristic(Characteristic.On).getValue();
    }
    else {
      self.log(self.name + " is down");
      XboxAccessory.prototype.getCharacteristic(Characteristic.On).getValue();
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

    // Don't really care about powerOn errors, and don't want more than one callback
    setTimeout(function() {
      ping.sys.probe(this.ip, function(isAlive){
        self.log("isAlive is");
        console.log(isAlive);
        if ((isAlive) ? 0:1 == powerOn) {
          self.log("Power toggle worked");
          callback(1);
        }
        else {
          self.log("Power toggle failed");
          callback(0);
        }
        
      });
    }, 5000);
    
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
