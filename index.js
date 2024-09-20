const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const WebSocket = require("ws");
//create node app
const app = express();

//listen node app
const PORT = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());

const server = app.listen(PORT, () => console.log("app running in :", PORT));

//create web socket
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("new client connected");
  ws.on("message", (message) => {
    console.log(`message recieved :${message}`);
    //broadcasting the message\
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.on("close", () => {
    console.log("client disconnected");
  });
});
