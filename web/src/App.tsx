import type { Component } from "solid-js";
import { For } from "solid-js";

import User  from "./components/User"
import Message  from "./components/Message"
import Button from "./components/Button"
import Header from "./components/Header"
import Footer from "./components/Footer"

import styles from "./App.module.css";

const App: Component = () => {
  let messages = [
    {
      from: "0x00000",
      message: "great point @guthl.eth!",
      hash: "1234"
    },
    {
      from: "0x11111",
      message: "gm",
      hash: "5678"
    },
    {
      from: "0x2fdsa3",
      message: "what is this app??? what is www.snuggly.com??",
      hash: "9012"
    }
  ]

  return (
    <div class={styles.container}>
      <Header></Header>
      <div class={styles.login}>
        <Button content="Login with Ethereum"></Button>
      </div>
      <div class={styles.messages}>
        <For each={messages}>{(message) =>
          <div onclick={() => { window.location.assign("/m/" + message.hash) }} class={styles.content}>
            <div>
              <User address={message.from}></User>
              <Message message={message.message}></Message>
            </div>
            <hr/>
          </div>
        }</For>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default App;