(function () {
  'use strict';

  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  let socket = new WebSocket("wss://ws.zxhy.site");
  socket.onopen = () => {
    console.log("rpc \u670D\u52A1\u8FDE\u63A5\u5DF2\u5EFA\u7ACB");
    setWindowNo();
  };
  socket.onclose = (e) => {
    console.log(33);
  };
  socket.onmessage = (event) => {
    if (event.data == "ping") return;
    const msg = JSON.parse(event.data);
    console.log("\u6536\u5230\u6D88\u606F:", msg);
    if (["crawl-html", "crawl-pdf"].includes(msg.type)) {
      setTaskData({
        status: "busy",
        id: msg.id,
        type: msg.type,
        url: msg.message
      });
      window.location.href = "https://" + msg.message;
    }
    if (msg.type === "registeredWindow") {
      if (msg.status === "error") {
        alert(msg.message);
        setWindowNo();
      } else {
        GM_setValue("__win_no", msg.message);
        GM_deleteValue("__task_data");
      }
    }
  };
  function setWindowNo() {
    window.deleteWinNo = function() {
      GM_deleteValue("__win_no");
      GM_deleteValue("__task_data");
    };
    const windowNo = GM_getValue("__win_no", "");
    if (windowNo) {
      console.log("\u7A97\u53E3\u7F16\u53F7:", windowNo);
      const task = getTaskData();
      if (task.status === "busy") getTargetResource(task, socket);
      sendMessage(socket, {
        type: "addWindow",
        message: windowNo,
        windowStatus: task.status
      });
      return;
    }
    let userInput = prompt("\u8BF7\u8F93\u5165\u7A97\u53E3\u7F16\u53F7");
    if (userInput !== null) {
      socket.send(
        JSON.stringify({
          type: "registeredWindow",
          message: userInput
        })
      );
    } else {
      setWindowNo();
    }
  }
  function sendMessage(socket2, msg) {
    socket2.send(JSON.stringify(msg));
  }
  function setTaskData(data) {
    GM_setValue("__task_data", JSON.stringify(data));
  }
  function getTaskData() {
    return JSON.parse(
      GM_getValue("__task_data", JSON.stringify({ id: "", status: "idle" }))
    );
  }
  function clean() {
    sendMessage(socket, {
      type: "setStatus",
      status: "idle"
    });
    GM_deleteValue("__task_data");
  }
  function getTargetResource(task, socket2) {
    return __async(this, null, function* () {
      if (task.type === "crawl-pdf") {
        const response = yield fetch("https://" + task.url);
        const pdfBlob = yield response.blob();
        const arrayBuffer = yield pdfBlob.arrayBuffer();
        socket2.send(arrayBuffer);
        clean();
        return;
      }
      setTimeout(() => {
        socket2.send(document.documentElement.outerHTML);
        clean();
      }, 3e3);
    });
  }

})();
