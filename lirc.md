# LiRC Setup

To an extent, you'll need to get your own IR blaster configured on your own but I've included the necessary lircd.conf contents which contains all of the codes used to run an Xbox One. The only important ones to this project or `PowerOn` and `PowerOff`.

## Hardware

I'm using a Raspberry Pi 3 runnig Raspbian 8.0 along with this hardware (https://www.amazon.com/dp/B00SSRVL2I/ref=wl_it_dp_o_pC_nS_ttl?_encoding=UTF8&colid=Y22XBDZ3VX4J&coliid=I1PUDG8SQ9MOJ8) attached to GPIO port 26. I'm using only the IR led, not the receiver as it isn't needed for this project. You should be able to use any IR blaster that works with LiRC, I just happened to have this around. 

## Software Setup

Once you have LiRC working at all with your system you need only replace the `/etc/lirc/lircd.conf` file contents with what is shown below:

```
begin remote

  name  XBOX-ONE
  bits           16
  flags SPACE_ENC|CONST_LENGTH
  eps            30
  aeps          100

  header       9061  4460
  one           596  1662
  zero          596   527
  ptrail        582
  repeat       9032  2232
  pre_data_bits   16
  pre_data       0x11B
  gap          107260
  toggle_bit_mask 0x0

      begin codes
          XboxFancyButton          0x26D9
          View                     0x7689
          Menu                     0xF609
          Up                       0x7887
          Down                     0xF807
          Left                     0x04FB
          Right                    0x847B
          Select                   0x44BB
          Back                     0xC43B
          Guide                    0x649B
          VolumeUp                 0x08F7
          VolumeDown               0x8877
          Mute                     0x708F
          ChannelUp                0x48B7
          ChannelDown              0xC837
          Rewind                   0xA857
          FastForward              0x28D7
          Play                     0x0EF1
          Previous                 0xD827
          Next                     0x58A7
          Stop                     0x9867
          PowerOff                 0x946B
          PowerOn                  0x54AB
      end codes

end remote
```

You can now test that LiRC is working properly by issuing `irsend XBOX-ONE PowerOn SEND-ONCE` and see if your Xbox One turns on. Note that some IR LEDs are very focused and must be pointed directly at the Xbox One's IR port which seems to be near the power button.