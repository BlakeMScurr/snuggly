import { useParams } from "solid-app-router";
import { Component, onMount } from "solid-js";
import hljs from "highlight.js";

import { request, messageStore } from "../store";
import { feltToString } from "../util";

const StorageProof: Component = () => {
    const params = useParams();
    let [store, _] = messageStore()

    let m = store.messages.filter((m: request) => m.metadata.hash === params.hash)[0]
    onMount(() => {
        hljs.highlightAll()
    })

    let code = `
# This code proves that the message was stored at block ${m.metadata.block}.
# The state root of all messages is publicly posted to StarkNet, and the
# following is a merkle proof relating the state root to the message.

from starkware.crypto.signature.signature import pedersen_hash


# The entire message is represented in the following json: ${JSON.stringify(m.content)}
# The message string is defined as a list of cairo field elements above. The message is:
# ${feltToString(m.content.message)}
let messageHash = pedersen_hash(${m.content.type}, ${m.content.blocknumber}, ${m.content.app}, ${m.content.from}, ${m.content.signature}, ${m.content.message.length}, ${m.content.message})

let stateRoot = ${m.metadata.root}
print(messageHash)

print(pedersen_hash(1,2))
print(pedersen_hash(3,4))
`

    return (
        <>
            <pre><code class="language-python">{code}</code></pre>
            {/* <p class="secondary"><a class="secondary" href={`https://voyager.online/tx/${m.metadata.hash}`}>State root {m.metadata.hash}</a></p> */}
        </>
    );
};

export default StorageProof;