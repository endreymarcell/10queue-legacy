<script lang="ts">
    import type { Task } from "$lib/modules/taskList/tasks"
    import { dispatch } from "$lib/logical/logicHelpers"
    import { appState, appLogic, appState } from "../../logic"
    import { formatTimeForHumans } from "$lib/helpers/utils"
    import HamburgerMenu from "$lib/modules/hamburgerMenu/HamburgerMenu.svelte"

    export let index: number
    let displayIndex: number
    $: displayIndex = index + 1

    export let task: Task
    let isEditing: boolean
    let currentTitle: string

    appState.subscribe(state => {
        const wasEditing = isEditing
        isEditing = state.isEditingTaskTitle && state.activeTaskIndex === index
        const isStartingEditing = !wasEditing && isEditing
        if (isStartingEditing) {
            currentTitle = state.tasks[state.activeTaskIndex].title
        }
    })

    function startEditing() {
        currentTitle = task.title
        dispatch(appLogic.startedEditingTaskTitle.action())
    }

    function onInputKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            if (currentTitle !== "") {
                handleFinishedEditing()
                // Without this, the Enter is caught by the general listener too and it finishes the task immediately
                event.stopPropagation()
            }
        } else if (event.key === "Escape") {
            handleAbortedEditing()
        }
    }

    function handleFinishedEditing() {
        dispatch(appLogic.stoppedEditingTaskTitle.action(currentTitle))
    }

    function handleAbortedEditing() {
        currentTitle = task.title
        dispatch(appLogic.stoppedEditingTaskTitle.action(""))
    }

    const handleDeleteClicked = () => dispatch(appLogic.taskDeleteRequested.action())
    const handleFinishClicked = () => dispatch(appLogic.taskFinishRequested.action())
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
<div
    class="task-details"
    class:active={$appState.activeTaskIndex === index}
    on:click|capture={handleRowClicked}
    on:dblclick={startEditing}
    style={`--face-color: ${task.style.foregroundColor}; --shadow-color: ${task.style.backgroundColor}`}
>
    <div class="task-description">
        <div class="index" class:hidden={$appState.isRunning}>{displayIndex}.</div>
        {#if isEditing}
            <!-- svelte-ignore a11y-autofocus -->
            <input on:keydown={onInputKeyDown} type="text" bind:value={currentTitle} autofocus />
        {:else}
            <div class="task-title" on:click={startEditing}>{task.title}</div>
        {/if}
    </div>
    {#if !isEditing}
        {#if $appState.isRunning || task.secondsSpentInPreviousRuns > 0}
            <div class="timer">
                {formatTimeForHumans(task.secondsSpentInPreviousRuns + task.secondsSpentInCurrentRun)}
            </div>
        {/if}
        <div class="task-actions">
            {#if index === 0}
                <div on:click={handleStartStopClicked}>
                    {#if $appState.isRunning}⏸️{:else}▶️{/if}
                </div>
                <div on:click={handleFinishClicked}>✅️</div>
            {/if}
            <div on:click={startEditing}>✏️</div>
            {#if !$appState.isRunning}
                <div on:click={handleMoveUpClicked}>⬆️</div>
                <div on:click={handleMoveDownClicked}>⬇️️</div>
                <div on:click={handleDeleteClicked}>❌</div>
            {/if}
        </div>
        <div class="hamburger-menu">
            <HamburgerMenu>
                {#if index === 0}
                    <div on:click={handleStartStopClicked}>
                        {#if $appState.isRunning}⏸️{:else}▶️{/if}
                    </div>
                    <div on:click={handleFinishClicked}>✅️</div>
                {/if}
                <div on:click={startEditing}>✏️</div>
                {#if !$appState.isRunning}
                    <div on:click={handleMoveUpClicked}>⬆️</div>
                    <div on:click={handleMoveDownClicked}>⬇️️</div>
                    <div on:click={handleDeleteClicked}>❌</div>
                {/if}
            </HamburgerMenu>
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
        --face-color: floralwhite;
        --shadow-color: lightgrey;

        width: 100%;
        height: calc(var(--task-height) - 2 * var(--padding));
        padding: var(--padding);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--font-size);
        cursor: pointer;
        background-color: var(--face-color);
        box-shadow: 1px -1px var(--shadow-color), 2px -2px var(--shadow-color), 3px -3px var(--shadow-color),
            4px -4px var(--shadow-color), 5px -5px var(--shadow-color), 6px -6px var(--shadow-color),
            7px -7px var(--shadow-color), 8px -8px var(--shadow-color);
        border-radius: var(--task-border-radius);
    }

    .task-details.active {
        border: 3px solid floralwhite;
    }

    .index.hidden {
        opacity: 0;
    }

    .task-description {
        margin-left: 10px;
        width: 100%;
    }

    .task-description > div {
        margin-right: var(--field-spacing);
    }

    .task-title {
        cursor: text;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .timer {
        font-family: "Courier New", Courier, monospace;
        font-size: 14px;
        color: darkslategrey;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        padding: 4px 6px 2px;
        font-weight: bold;
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
        width: 100%;
        font-size: var(--font-size);
        border: 0;
        outline: none;
        background: var(--transparent);
    }

    .hamburger-menu {
        display: none;
    }

    @media screen and (max-width: 700px) {
        .task-actions {
            display: none;
        }

        .hamburger-menu {
            display: block;
        }
    }
</style>
