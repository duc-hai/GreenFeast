import { createContext } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
// export const SOCKET_URL = `${process.env.REACT_APP_API}`;
export const SOCKET_URL = "";
const token = Cookies.get("accessToken");
const socket = io(`https://greenfeast.space/notificationssss`, {
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
