class SocketIoService {
  users = {};
  io = null;

  listenSocketEvent = (io) => {
    try {
      this.io = io;
      io.on("connection", (socket) => {
        // console.log(`A user connected with id:::: ${socket.id}`)
        // console.log(socket.user)
        this.users[socket.user] = socket.id;
        // console.log(this.users)
        // socket.emit('notification', 'Something message')
        // console.log(this.users)

        socket.on("disconnect", () => {
          // console.log('User disconnected')
          delete this.users[socket.user];
          // console.log(this.users)
        });
      });
    } catch (error) {
      console.error(`Error at listenSocketEvent: ${error.message}`);
    }
  };

  sendNotification = (title, message, userId) => {
    try {
      if (!this.io) throw new Error("Socket instance not initialized");
      console.log(userId);
      console.log(this.users);
      const socketId = this.users[userId];
      console.log("id", socketId);
      // if (socketId)
      this.io.emit("notification", { title, message });
      this.io.to(socketId).emit("notification", { title, message });
      //if user is not connected, don't send notification
    } catch (error) {
      console.error(`Error at sendNotification: ${error.message}`);
    }
  };
}

module.exports = new SocketIoService();
