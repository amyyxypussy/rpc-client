// 1. 创建连接
let socket = new WebSocket("wss://ws.zxhy.site");

// 2. 事件监听
socket.onopen = () => {
  console.log("rpc 服务连接已建立");
  setWindowNo();
};

socket.onclose = (e) => {
  console.log(33);
};

socket.onmessage = (event) => {
  if (event.data == "ping") return;

  const msg = JSON.parse(event.data);

  console.log("收到消息:", msg);

  if (["crawl-html", "crawl-pdf"].includes(msg.type)) {
    setTaskData({
      status: "busy",
      id: msg.id,
      type: msg.type,
      url: msg.message,
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
  window.deleteWinNo = function () {
    GM_deleteValue("__win_no");
    GM_deleteValue("__task_data");
  };

  // window.deleteWinNo();

  const windowNo = GM_getValue("__win_no", "");

  if (windowNo) {
    console.log("窗口编号:", windowNo);

    const task = getTaskData();

    if (task.status === "busy") getTargetResource(task, socket);

    sendMessage(socket, {
      type: "addWindow",
      message: windowNo,
      windowStatus: task.status,
    });
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
  } else {
    setWindowNo();
  }
}

// 3. 发送消息
function sendMessage(socket: any, msg: Record<string, any>) {
  socket.send(JSON.stringify(msg));
}

type Task = {
  id: string;
  status: "busy" | "idle";
  type: string;
  url: string;
};
function setTaskData(data: Task) {
  GM_setValue("__task_data", JSON.stringify(data));
}

function getTaskData(): Task {
  return JSON.parse(
    GM_getValue("__task_data", JSON.stringify({ id: "", status: "idle" }))
  ) as Task;
}

function clean() {
  sendMessage(socket, {
    type: "setStatus",
    status: "idle",
  });
  GM_deleteValue("__task_data");
}

async function getTargetResource(task: Task, socket: any) {
  if (task.type === "crawl-pdf") {
    const response = await fetch("https://" + task.url);
    const pdfBlob = await response.blob();

    const arrayBuffer = await pdfBlob.arrayBuffer();
    socket.send(arrayBuffer);
    clean();
    return;
  }

  setTimeout(() => {
    socket.send(document.documentElement.outerHTML);

    clean();
  }, 3000);
}

async function downloadPDFFromAPI(targetUrl: string) {
  const response = await fetch(targetUrl);
  const blob = await response.blob();

  return blob;
}
