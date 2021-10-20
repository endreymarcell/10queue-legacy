<script lang="ts">
    import { onMount } from "svelte"
    import Header from "./header/Header.svelte"
    import TaskList from "./taskList/TaskList.svelte"
    import { setupKeyboardShortcutListener } from "./keyboardShortcuts/logic"
    import { logger } from "$lib/logger"
    import { setupKeyboardShortcuts as setupUndoKeyboardShortcuts } from "$lib/undo/keyboardShortcuts"
    import { setupKeyboardShortcuts as setupHelpModalKeyboardShortcuts } from "$lib/help/keyboardShortcuts"
    import { setupAutoSave } from "$lib/persistence/logic"
    import { dispatch } from "$lib/logicHelpers"
    import { appLogic, appState } from "$lib/logic"
    import { DEFAULT_PAGE_TITLE } from "$lib/const"
    import HelpModal from "./help/HelpModal.svelte"

    onMount(() => {
        setupKeyboardShortcutListener()
        setupUndoKeyboardShortcuts()
        setupHelpModalKeyboardShortcuts()
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
<HelpModal isOpen={$appState.isHelpModalOpen} />

<style>
    .outer-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--page-background);
    }

    .inner-container {
        width: 100%;
        max-width: 1000px;
    }

    @media screen and (max-width: 700px) {
        .inner-container {
            width: calc(100% - 60px);
        }
    }
</style>
