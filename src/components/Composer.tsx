import { Component, createEffect, createSignal, untrack } from "solid-js";
import { splitByLink } from "../util";
import Button from "./Button";
import { default as styles } from "./Composer.module.css";

const User: Component = (props) => {
    let [posted, post] = createSignal(false)
    let [text, setText] = createSignal("")

    let input;
    let [renderer, setRenderer] = createSignal(null)
    // render links
    let oninput = () => {
        setText(input.innerText)
        post(false)
        let parent = document.createElement('div');
        input.childNodes.forEach((node) => {
            parent.appendChild(node.cloneNode())
        })

        let parts = splitByLink(parent.innerText)
        parts.forEach((part) => {
            if (part.type !== "text") {
                parent.innerHTML = parent.innerHTML.replace(part.text, `<span>${part.text}</span>`)
            }
        })

        setRenderer(parent)
    }

    createEffect(() => {
        if (posted()) {
            props.setPost(untrack(text))
            setText("")
            input.innerText = ""
            setRenderer(document.createElement('div'))
        }
    })

    return (
        <div class={styles.container}>
            <div ref={input} oninput={oninput} class={styles.input} placeholder="gm" contenteditable="true"></div>
            <div class={styles.renderer}>
                {renderer}
            </div>
            <div class={styles.button}>
                <Button active={() => {return text() !== ""}} clickSignal={post} content="post"></Button>
            </div>
        </div>
    );
};

export default User;
