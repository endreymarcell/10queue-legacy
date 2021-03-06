import preprocess from "svelte-preprocess"
import node from "@sveltejs/adapter-node"

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: preprocess(),

    kit: {
        target: "#svelte",
        adapter: node({ env: { port: process.env.PORT } }),
    },
}

export default config
