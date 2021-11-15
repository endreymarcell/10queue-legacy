<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit"
    export const load: Load = async ({ fetch }) => {
        const response = await fetch("/api/tasks")
        if (response.ok) {
            const body = await response.json()
            return {
                props: {
                    appProps: body,
                },
            }
        } else {
            return {
                status: response.status,
                error: "fucked",
            }
        }
    }
</script>

<script lang="ts">
    import { logger } from "$lib/helpers/logger"
    import App from "$lib/App.svelte"
    import "../global.css"
    import type { SavableState } from "$lib/modules/taskList/logic/state"
    import { onMount } from "svelte"
    import StateInspector from "$lib/modules/debugger/StateInspector.svelte"

    let shouldShowDebug = false
    export let appProps: { savedState: SavableState } = null
    onMount(() => {
        // It would be great to do this in the onMount action
        // but then the onMount action itself won't be logged
        logger.autoSetLevel()
        shouldShowDebug = location.href.includes("debugger")
    })
</script>

<App initialState={appProps.savedState} />
{#if shouldShowDebug}
    <StateInspector />
{/if}
