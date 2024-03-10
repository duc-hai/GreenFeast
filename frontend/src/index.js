import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ConfigProvider } from "antd";
window.store = store;

const theme = {
  token: {
    fontSize: 14,
    colorPrimary: "#5c9f67",
    colorBorder: "#5c9f67",
    colorLink: "#5c9f67",
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
