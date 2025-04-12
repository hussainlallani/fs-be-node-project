import EventEmitter from "events";

var url = "http://mylogger.io/loh";

class Logger extends EventEmitter {
  log(message) {
    // Send an http request
    console.log(message);
    // Step2: Trigger an event
    this.emit("messageLogged", { id: 1, url: "http://" });
  }
}

export default Logger;
