<script lang="ts">
    import { onMount } from "svelte"
    import Header from "./header/Header.svelte"
    import TaskList from "./taskList/TaskList.svelte"
    import { setupKeyboardShortcutListener } from "./keyboardShortcuts/logic"
    import { logger } from "$lib/logger"
    import { setupKeyboardShortcuts } from "$lib/undo/keyboardShortcuts"

    onMount(() => {
        setupKeyboardShortcutListener()
        setupKeyboardShortcuts()
        logger.autoSetLevel()
    })
</script>

<svelte:head>
    <title>10queue</title>
</svelte:head>

<Header />
<TaskList />
