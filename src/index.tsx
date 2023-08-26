import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { ColorModeScript } from "@chakra-ui/react";
import { store } from "./components/redux";
import { Provider } from "react-redux";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const initialState = {
  channels: null,
  channel: 0,
  user: null,
  channelUsers: null,
  chats: [],
  database: null,
  db: null,
  auth: null,
  focus: 0,
  drawer: "",
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
