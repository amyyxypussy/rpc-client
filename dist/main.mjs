(function () {
  'use strict';

  const socket = new WebSocket("wss://ws.zxhy.site");
  socket.onopen = () => {
    console.log("rpc \u670D\u52A1\u8FDE\u63A5\u5DF2\u5EFA\u7ACB");
    setWindowNo();
  };
  socket.onmessage = (event) => {
    console.log("\u6536\u5230\u6D88\u606F:", event.data);
    const msg = JSON.parse(event.data);
    if (msg.type === "registeredWindow") {
      if (msg.status === "error") {
        alert(msg.message);
        setWindowNo();
      } else {
        console.log("cd", msg.message);
        GM_setValue("__win_no", msg.message);
      }
    }
  };
  function setWindowNo() {
    window.deleteWinNo = function() {
      GM_deleteValue("__win_no");
    };
    const windowNo = GM_getValue("__win_no", "");
    if (windowNo) {
      console.log("\u7A97\u53E3\u7F16\u53F7:", windowNo);
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

})();
