const socket = io();

socket.on("newEntry", (data) => {
  console.log("📩 New data received:", data);
});
