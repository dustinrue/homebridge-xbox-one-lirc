var ping = require('ping');
var lirc = require('lirc_node');
var powerState = 0;
var pingTimer = null;
var switchService;

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

  ping.sys.probe(self.ip, function(isAlive) {
    powerState = isAlive;
    if (isAlive) {
      switchService.getCharacteristic(Characteristic.On).getValue();
    }
    else {
      switchService.getCharacteristic(Characteristic.On).getValue();
    }
  });
}

function startPinger(switchService, xboxAccessory) {
  pingTimer = setInterval(function() {
      pinger(switchService, xboxAccessory);
    }, 1000 * 5);
}

XboxAccessory.prototype = {

  setPowerState: function(powerOn, callback) {
    var self = this;

    // stop updating power status for awhile
    clearInterval(pingTimer);

    if (powerOn) {
      powerState = 1;
      lirc.irsend.send_once('XBOX-ONE', 'PowerOn', function() {
        self.log("Sending power on command to '" + self.name + "'...");
      });
      setTimeout(function() {
        startPinger(switchService, self);
      }, 150000);
    }
    else {
      powerState = 0;
      lirc.irsend.send_once('XBOX-ONE', 'PowerOff', function() {
        self.log("Sending power off command to '" + self.name + "'...");
      });
      setTimeout(function() {
        startPinger(switchService, self);
      }, 150000);
    }
    
    // we can't reliably determine if the Xbox has heard us.
    // The delay between power on and network availability depends on 
    // if the user is using power save mode vs instant on. 
    // Power off doesn't down the network interface immediately and
    // the Xbox often brings up the interface to check for updates
    callback();
  },

  getPowerState: function(callback) {
    this.log("is " (powerState) ? "up":"down");
    callback(null, powerState);
  },

  identify: function(callback) {
    this.log("Identify...");
    callback();
  },

  getServices: function() {
    switchService = new Service.Switch(this.name);

    switchService
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPowerState.bind(this));

    switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerState.bind(this));

    var xboxAccessory = this;

    // setup a timer to check the power state of the Xbox
    // This isn't terribly reliable for reasons listed above
    // but is better than nothing
    startPinger(switchService, xboxAccessory);

    return [switchService];
  }
};
