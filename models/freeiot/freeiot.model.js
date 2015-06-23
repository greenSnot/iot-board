!function(){
  if (!window.iotboard){
    console.log("iotboard not initialized!");
    return;
  }

  var model = {};

  /**
   * called when widget's status is changed.
   * @param  {String} widget [the widget name]
   * @param  {String} label  [the widget label to distinguish different widget of same type/name]
   * @param  {Object} status [the new status of widget]
   * @return {None}
   */
  model.onWidgetStatusChanged = function(widget, label, status){
    switch(widget){
      case "text":
        console.log(status.text);
        break;
      case "switch":
        (function(){
          console.log("switch status changed:" + label);
          console.log(JSON.stringify(status));
          var data = {};
          data[label] = status.on?[1]:[0];
          window.pando.sendCommand(data, function(responseData) {
             console.log("sendCommand callback....");
             console.log("responseData: " + responseData);
          });
        }());
        break;
      case "led":
        console.log("led status changed:" + label);
        console.log(JSON.stringify(status));
        break;
      default:
        console.log("widget {" + widget + "}" + " handler not found!");
        break;
    }
  }

  /**
   * get widget current status 
   * @param  {String} widget [the widget name]
   * @param  {String} label  [the widget label to distinguish different widget of same type/name]
   * @param  {callback} callback [the result status will be passed through callback(status)]
   * @return {None}
   */
  model.getCurrentStatus = function(widget, label, callback) {
    switch(widget){
      case "text":
        callback({
          text: "status changed:" + (new Date())
        })
        break;
      case "switch":
        console.log(label);
        (function(){
          window.pando.getDeviceStatus(function(responseData) {
            var data = responseData.data;
            callback({
              on: (data[label][0] == 0)?false:true
            });
          });
        })();
        break;
      case "led":
        callback({
          red: Math.floor(Math.random()*256),
          green: Math.floor(Math.random()*256),
          blue: Math.floor(Math.random()*256),
          freq: Math.round(Math.random()*1000),
          white: Math.floor(Math.random()*256),
        });
        break;
      default:
        console.log("widget {" + widget + "}" + " handler not found!");
        break;
    }
  }

  window.iotboard.setModel(model);
}();