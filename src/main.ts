// 1. 创建连接
const socket = new WebSocket("wss://ws.zxhy.site");

// 2. 事件监听
socket.onopen = () => {
  console.log("rpc 服务连接已建立");
  setWindowNo();
};

socket.onmessage = (event) => {
  console.log("收到消息:", event.data);

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
  window.deleteWinNo = function () {
    GM_deleteValue("__win_no");
  };

  // window.deleteWinNo();

  const windowNo = GM_getValue("__win_no", "");

  if (windowNo) {
    console.log("窗口编号:", windowNo);
    return;
  }

  let userInput = prompt("请输入窗口编号");
  if (userInput !== null) {
    socket.send(
      JSON.stringify({
        type: "registeredWindow",
        message: userInput,
      })
    );

    // sendMessage();
  } else {
    setWindowNo();
  }
}

// 3. 发送消息
function sendMessage(msg: Record<string, any>) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
}
