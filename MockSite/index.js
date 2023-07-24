console.log("Hello World!");

// var socket = new WebSocket("ws://localhost:3030/echo");

// socket.onopen = function () {
//   console.log("WebSocket connection established.");

//   // You can send data to the server after the connection is open
//   socket.send("Hello, server!");
// };

// socket.onmessage = function (event) {
//   console.log("Received message from server:", event.data);
// };

// socket.onclose = function (event) {
//   console.log("WebSocket connection closed with code:", event.code);
// };

// socket.onerror = function (error) {
//   console.error("WebSocket error:", error);
// };

fetch("http://127.0.0.1:3030/Task", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ a: "b" }),
})
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
