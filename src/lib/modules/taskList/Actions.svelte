<script lang="ts">
    import HamburgerMenu from "$lib/modules/hamburgerMenu/HamburgerMenu.svelte"
    import { appLogic, appState } from "$lib/logic"
    import { dispatch } from "$lib/helpers/logicHelpers"
    import { canUndo as _canUndo, canRedo as _canRedo } from "$lib/modules/undo/logic"

    let canUndo = false
    let canRedo = false
    let canSave = true
    appState.subscribe(state => {
        canUndo = _canUndo(state)
        canRedo = _canRedo(state)
        // TODO canSave = has unsaved changes
    })

    const handleSaveClicked = () => dispatch(appLogic.saveRequested.action())
    const handleUndoClicked = () => dispatch(appLogic.undo.action())
    const handleRedoClicked = () => dispatch(appLogic.redo.action())
    const handleHelpClicked = () => dispatch(appLogic.openHelpModalRequested.action())
</script>

<div class="container">
    <div on:click={handleSaveClicked} class:disabled={!canSave}>💾</div>
    <div on:click={handleUndoClicked} class:disabled={!canUndo}>↩️</div>
    <div on:click={handleRedoClicked} class:disabled={!canRedo}>↪️</div>
    <div on:click={handleHelpClicked}>❓</div>
</div>
<div class="hamburger-menu">
    <HamburgerMenu>
        <div on:click={handleSaveClicked} class:disabled={!canSave}>💾</div>
        <div on:click={handleUndoClicked} class:disabled={!canUndo}>↩️</div>
        <div on:click={handleRedoClicked} class:disabled={!canRedo}>↪️</div>
        <div on:click={handleHelpClicked}>❓</div>
    </HamburgerMenu>
</div>

<style>
    .container {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 10px;
    }

    .container > div {
        margin-right: 20px;
        cursor: pointer;
    }

    .disabled {
        opacity: 0.4;
        pointer-events: none;
    }

    .hamburger-menu {
        width: 100%;
        text-align: right;
        height: 50px;
        margin-top: -20px;
        position: relative;

        display: none;
    }

    @media screen and (max-width: 700px) {
        .container {
            display: none;
        }

        .hamburger-menu {
            display: block;
        }

        .hamburger-menu div:not(:last-child) {
            margin-bottom: 20px;
        }
    }
</style>
