<script lang="ts">
    import type { Task } from "$lib/task"
    import {createEventDispatcher} from "svelte";

    export let index: number
    export let task: Task
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

    const dispatch = createEventDispatcher();
    function handleFinishedEditing() {
        isEditing = false
        dispatch("taskTitleEdited", { currentTitle, index: index - 1 })
    }

    function handleAbortedEditing() {
        currentTitle = task.title
        isEditing = false
    }
</script>

<div class="task-details">
    <div class="task-description">
        <div>{index}.</div>
        {#if isEditing}
            <input on:keydown={onInputKeyDown} on:blur={handleFinishedEditing} type="text" bind:value={currentTitle} autofocus />
        {:else}
            <div on:click={startEditing}>{task.title}</div>
        {/if}
    </div>
    {#if !isEditing}
        <div class="task-actions">
            <div>Complete</div>
            <div on:click={startEditing}>Edit</div>
            <div>Delete</div>
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
    }
</style>
