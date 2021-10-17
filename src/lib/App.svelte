<script lang="ts">
    import { onMount } from "svelte"
    import Header from "./header/Header.svelte"
    import TaskList from "./taskList/TaskList.svelte"
    import { setupKeyboardShortcutListener } from "./keyboardShortcuts/logic"
    import { logger } from "$lib/logger"
    import { setupKeyboardShortcuts } from "$lib/undo/keyboardShortcuts"
    import { setupAutoSave } from "$lib/persistence/logic"
    import { dispatch } from "$lib/logicHelpers"
    import { appLogic } from "$lib/logic"
    import { DEFAULT_PAGE_TITLE } from "$lib/const"

    onMount(() => {
        setupKeyboardShortcutListener()
        setupKeyboardShortcuts()
        setupAutoSave()
        logger.autoSetLevel()
        dispatch(appLogic.loadRequested.action())
    })
</script>

<svelte:head>
    <title>{DEFAULT_PAGE_TITLE}</title>
</svelte:head>

<div class="outer-container">
    <div class="inner-container">
        <Header />
        <TaskList />
    </div>
</div>

<style>
    .outer-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: gold;
    }

    .inner-container {
        width: 100%;
        max-width: 1000px;
    }
</style>
