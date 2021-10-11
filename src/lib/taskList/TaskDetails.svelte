<script lang="ts">
    import type { Task } from "$lib/taskList/tasks"
    import { dispatch } from "../logicHelpers"
    import { appState, appLogic } from "../logic"

    export let index: number
    let displayIndex: number
    $: displayIndex = index + 1

    export let task: Task
    let isEditing: boolean
    let currentTitle: string

    appState.subscribe(value => (isEditing = value.isEditingTaskTitle && value.activeTaskIndex === index))

    function startEditing() {
        currentTitle = task.title
        dispatch(appLogic.startedEditingTaskTitle.action())
    }

    function onInputKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleFinishedEditing()
        } else if (event.key === "Escape") {
            handleAbortedEditing()
        }
    }

    function handleFinishedEditing() {
        dispatch(appLogic.textInputFocusChanged.action("focus"))
        dispatch(appLogic.taskTitleEdited.action(currentTitle))
    }

    function handleAbortedEditing() {
        currentTitle = task.title
        dispatch(appLogic.textInputFocusChanged.action("focus"))
    }

    const handleDeleteClicked = () => dispatch(appLogic.taskDeleteRequested.action())
    const handleStartStopClicked = () => dispatch(appLogic.taskStartStopRequested.action())
    const handleMoveUpClicked = () => dispatch(appLogic.taskMoveUpRequested.action())
    const handleMoveDownClicked = () => dispatch(appLogic.taskMoveDownRequested.action())
    const handleRowClicked = () => dispatch(appLogic.taskClicked.action(index))
</script>

<!--
    Handling on:click in the capture phase so that it comes before other handlers.
    This is to prevent bugs when eg. clicking on a reordering arrow first reorders and then selects.
    With moving the row's on:click handler to the capture phase, selection runs before the arrow's on:click handler.
    Dodgy and brittle.
-->
<div class="task-details" class:active={$appState.activeTaskIndex === index} on:click|capture={handleRowClicked}>
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
