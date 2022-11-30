const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);

app.use(cors());

let elements = [];

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected");
  io.to(socket.io).emit("whiteboard-state", elements);

  socket.on("element-update", (elementData) => {
    updateLocalElement(elementData);

    socket.broadcast("element-update", elementData);
  });
});

app.get("/", (req, res) => {
  res.send("Hello, server is working..");
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log("server is running on: ", PORT);
});

const updateLocalElement = (elementData) => {
  const elementInx = elements.findIndex((ele) => ele.id === elementData.id);

  if (elementData === -1) {
    return elements.push(elementData);
  } else {
    return (elements[elementInx] = elementData);
  }
};
