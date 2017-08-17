# Mô tả

App điều khiển bot thông qua Bluetooth LE tương thích với Android 4.4 trở lên.

# Thư viện sử dụng

* BLE Plx: https://github.com/Polidea/react-native-ble-plx
* Stack Navigator: https://github.com/react-community/react-navigation
* Orientation: https://github.com/yamill/react-native-orientation

# Screenshot

![http://imgur.com/TnLu2EL](http://i.imgur.com/TnLu2EL.png)
![http://imgur.com/Uggb1cZ](http://imgur.com/Uggb1cZ.png)

# 
## Tìm thiết bị

```javascript
  _scan(){
    var {devices}= this.state;
    if(devices.length != 0){ //clear devices array
      devices.length = 0
    }
    this.manager.startDeviceScan(null,null, (error, device) => { 
      if (error){
        return
      }
      if(device.name != null){
        devices.unshift ({
          name: device.name,
          id: device.id,
          rssi: device.rssi,
      })
      }
      
      this.setState({devices, refresh: false})
      console.log(this.state.devices)
    })
  }
```

## Connect

```javascript
  _connect(deviceID,deviceName){
    var info = []
    var characteristicForWrite = []
    this.manager.stopDeviceScan()
    this.manager.connectToDevice(deviceID) //Connect to selected device
      .then(function(device){
        return device.discoverAllServicesAndCharacteristics() // Discover all services and characteristics in device
      })
      .then((device) => {
        device.services()
          .then((services)=>{
            return device.characteristicsForService(services[2].uuid) //Select Characteristics was make in firmware
          })
        .then((characteristics) => {
          for(var i in characteristics){
            if(characteristics[i].isWritableWithResponse === true)
              characteristicForWrite = characteristics[i]
          }
          console.log(characteristicForWrite)
          return this.props.navigation.navigate('JoyStick',{info: characteristicForWrite, name: deviceName})
        })
      })
  }
```

## Di chuyển bot

Để điều khiển sẽ xác định vị trí hiện tại so với vị trí ban đầu để gữi các lệnh tương ứng xuống thiết bị:

  * Up: `AQ==` (0x01 in hex)
  * Down: `Aw==` (0x03 in hex)
  * Left: `Ag==` (0x02 in hex)
  * Right: `BA==` (0x04 in hex)
  * Stop: `BQ==` (0x05 in hex)

## Kĩ năng Bot