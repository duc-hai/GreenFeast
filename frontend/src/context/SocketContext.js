import { createContext } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
export const SOCKET_URL = "http://localhost:5020";
const token = Cookies.get("accessToken");
const socket = io("http://localhost:5020/notification", {
  auth: {
    token: token,
  },
});
export const SocketContext = createContext({});

const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
