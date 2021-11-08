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
    import App from "$lib/App.svelte"
    import "../global.css"
    import type { SavableState } from "$lib/modules/taskList/logic/state"

    export let appProps: { savedState: SavableState } = null
</script>

<App initialState={appProps.savedState} />
