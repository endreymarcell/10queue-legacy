<script lang="ts">
    import type { Task } from "$lib/tasks"
    import { dispatch, state } from "./state"

    export let index: number
    let displayIndex
    $: displayIndex = index + 1

    export let task: Task
    let isRunning = state.isRunning
    let isEditing: boolean
    let currentTitle: string

    function startEditing() {
        currentTitle = task.title
        isEditing = true
    }

    function onInputKeyDown(event) {
        if (event.key === "Enter") {
            handleFinishedEditing()
        } else if (event.key === "Escape") {
            handleAbortedEditing()
        }
    }

    function handleFinishedEditing() {
        isEditing = false
        dispatch({ type: "taskTitleEdited", index, title: currentTitle })
    }

    function handleAbortedEditing() {
        currentTitle = task.title
        isEditing = false
    }

    function handleDeleteClicked() {
        dispatch({ type: "deleteTask", index })
    }

    function handleStartClicked() {
        dispatch({ type: "taskStarted" })
    }

    function handlePauseClicked() {
        dispatch({ type: "taskPaused" })
    }
</script>

<div class="task-details">
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
                {#if $isRunning}
                    <div on:click={handlePauseClicked}>⏸️</div>
                {:else}
                    <div on:click={handleStartClicked}>▶️</div>
                {/if}
                <div>✅️</div>
            {/if}
            <div on:click={startEditing}>✏️</div>
            <div>⬆️</div>
            <div>⬇️️</div>
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
