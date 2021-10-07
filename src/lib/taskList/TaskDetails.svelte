<script lang="ts">
    import type { Task } from "$lib/taskList/tasks"
    import { appState } from "../state"
    import { dispatch } from "../eventHelpers"
    import { appLogic } from "../logic"

    export let index: number
    let displayIndex: number
    $: displayIndex = index + 1

    export let task: Task
    let isEditing: boolean
    let currentTitle: string

    function startEditing() {
        currentTitle = task.title
        isEditing = true
        dispatch(appLogic.textInputFocusChanged.action("focus"))
    }

    function onInputKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleFinishedEditing()
        } else if (event.key === "Escape") {
            handleAbortedEditing()
        }
    }

    function handleFinishedEditing() {
        isEditing = false
        dispatch(appLogic.textInputFocusChanged.action("focus"))
        dispatch(appLogic.taskTitleEdited.action(index, currentTitle))
    }

    function handleAbortedEditing() {
        currentTitle = task.title
        isEditing = false
        dispatch(appLogic.textInputFocusChanged.action("focus"))
    }

    const handleDeleteClicked = () => dispatch(appLogic.taskDeleteRequested.action(index))
    const handleStartStopClicked = () => dispatch(appLogic.taskStartStopRequested.action())
    const handleMoveUpClicked = () => dispatch(appLogic.taskMoveUpRequested.action(index))
    const handleMoveDownClicked = () => dispatch(appLogic.taskMoveDownRequested.action(index))
    const handleRowClicked = () => dispatch(appLogic.taskClicked.action(index))
</script>

<div class="task-details" class:active={$appState.activeTaskIndex === index} on:click={handleRowClicked}>
    <div class="task-description">
        <div>{displayIndex}.</div>
        {#if isEditing}
            <!-- svelte-ignore a11y-autofocus -->
            <input
                on:keydown={onInputKeyDown}
                on:blur={handleFinishedEditing}
                type="text"
                bind:value={currentTitle}
                autofocus
            />
        {:else}
            <div on:click={startEditing}>{task.title}</div>
        {/if}
    </div>
    {#if !isEditing}
        <div class="task-actions">
            {#if index == 0}
                <div on:click={handleStartStopClicked}>
                    {#if $appState.isRunning}⏸️{:else}▶️{/if}
                </div>
                <div>✅️</div>
            {/if}
            <div on:click={startEditing}>✏️</div>
            <div on:click={handleMoveUpClicked}>⬆️</div>
            <div on:click={handleMoveDownClicked}>⬇️️</div>
            <div on:click={handleDeleteClicked}>❌</div>
        </div>
    {/if}
</div>

<style>
    .task-details,
    .task-description,
    .task-actions {
        display: flex;
    }

    .task-details {
        width: 100%;
        display: flex;
        justify-content: space-between;
        --field-spacing: 20px;
        font-size: 30px;
        cursor: pointer;
    }

    .active {
        background-color: gold;
    }

    .task-description > div {
        margin-right: var(--field-spacing);
    }

    .task-actions > div {
        margin-left: var(--field-spacing);
        cursor: pointer;
    }

    input[type="text"] {
        font-size: 30px;
        border: 0;
        outline: none;
    }
</style>
