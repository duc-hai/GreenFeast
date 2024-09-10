import { createContext } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
export const SOCKET_URL = `${process.env.REACT_APP_API}`;
const token = Cookies.get("accessToken");
const socket = io(`${process.env.REACT_APP_API}/notification`, {
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
