import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import io from "socket.io-client";
import {
  fetchDataNotifi,
  getQuantityNotifi,
} from "../../Services/Notification";
import { Spin } from "antd";
export const NotifyContext = createContext(null);

const NotifyProvider = ({ children }) => {
  const [value, setValue] = useState({
    numberNotify: 0,
    listNotify: [],
  });
  const [numberNotify, setNumberNotify] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("accessToken");
  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user?._id) {
      console.log(token);
      // Connect to the Socket.IO server
      const newSocket = io("http://localhost:5020/notification", {
        auth: {
          token: token,
        },
      });

      newSocket.on("notification", (message) => {
        console.log("Message received:", message);
        setNumberNotify((pre) => !pre);
      });
      newSocket.on("connect_error", (err) => {
        console.error("Connection error:", err.message);
        // Handle the error, maybe redirect to login or show a message
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, []);

  const fetchQualityNotify = async () => {
    setLoading(true);
    try {
      const res = await getQuantityNotifi();
      console.log(res?.data);
      setValue((pre) => ({ ...pre, numberNotify: res?.data }));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const fetchDataNotifyHeader = async () => {
    setLoading(true);
    try {
      const res = await fetchDataNotifi();
      setValue((pre) => ({ ...pre, listNotify: res?.data || [] }));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  // useEffect(() => {
  //   Promise.all([fetchDataNotifyHeader(), fetchQualityNotify()]);
  // }, [numberNotify]);

  return (
    <NotifyContext.Provider value={{ value, setValue }}>
      {loading ? <Spin /> : children}
    </NotifyContext.Provider>
  );
};

export default NotifyProvider;
