<script lang="ts">
    import { onMount } from "svelte"
    import Header from "./modules/header/Header.svelte"
    import TaskList from "./modules/taskList/TaskList.svelte"
    import { setupKeyboardShortcutListener } from "./modules/keyboardShortcuts/logic"
    import { logger } from "$lib/helpers/logger"
    import { setupKeyboardShortcuts as setupUndoKeyboardShortcuts } from "$lib/modules/undo/keyboardShortcuts"
    import { setupKeyboardShortcuts as setupHelpModalKeyboardShortcuts } from "$lib/modules/help/keyboardShortcuts"
    import { setupAutoSave } from "$lib/modules/persistence/logic"
    import { dispatch } from "$lib/helpers/logicHelpers"
    import { appLogic, appState } from "$lib/logic"
    import { DEFAULT_PAGE_TITLE } from "$lib/helpers/const"
    import HelpModal from "./modules/help/HelpModal.svelte"

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
