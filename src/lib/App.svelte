<script lang="ts">
    import { onMount } from "svelte"
    import Header from "./header/Header.svelte"
    import TaskList from "./taskList/TaskList.svelte"
    import { setupKeyboardShortcutListener } from "./keyboardShortcuts/logic"
    import { logger } from "$lib/logger"

    onMount(() => {
        setupKeyboardShortcutListener()
        logger.autoSetLevel()
    })
</script>

<Header />
<TaskList />
