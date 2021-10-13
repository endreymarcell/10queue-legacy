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
        dispatch(appLogic.stoppedEditingTaskTitle.action(currentTitle))
    }

    function handleAbortedEditing() {
        currentTitle = task.title
        dispatch(appLogic.stoppedEditingTaskTitle.action(undefined))
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
            <div class="task-title" on:click={startEditing}>{task.title}</div>
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
        --font-size: 25px;
        --field-spacing: 20px;
        --padding: 5px;
        --shadow-color: darkslateblue;

        width: 100%;
        height: calc(var(--task-height) - 2 * var(--padding));
        padding: var(--padding);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--font-size);
        cursor: pointer;
        background-color: dodgerblue;
        box-shadow: 1px -1px var(--shadow-color), 2px -2px var(--shadow-color), 3px -3px var(--shadow-color),
            4px -4px var(--shadow-color), 5px -5px var(--shadow-color), 6px -6px var(--shadow-color),
            7px -7px var(--shadow-color), 8px -8px var(--shadow-color);
        border-radius: var(--task-border-radius);
    }

    .task-details.active {
        --active-color: floralwhite;
        color: var(--active-color);
        border: 3px solid var(--active-color);
    }

    .task-description {
        margin-left: 10px;
    }

    .task-description > div {
        margin-right: var(--field-spacing);
    }

    .task-actions {
        margin-right: 10px;
    }

    .task-actions > div {
        margin-left: var(--field-spacing);
        cursor: pointer;
        font-size: 22px;
    }

    input[type="text"] {
        font-size: var(--font-size);
        border: 0;
        color: var(--active-color);
        outline: none;
        background: var(--transparent);
    }
</style>
