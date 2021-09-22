<script lang="ts">
    import type { Task } from "$lib/task"
    import TaskDetails from "$lib/TaskDetails.svelte"
    import TaskPlaceholder from "$lib/TaskPlaceholder.svelte"

    export let index: number
    let displayIndex: number
    $: displayIndex = index + 1

    export let task: Task
</script>

<div class="task-row">
    {#if task !== undefined}
        <TaskDetails index={displayIndex} {task} />
    {:else}
        <TaskPlaceholder index={displayIndex} />
    {/if}
</div>

<style>
    .task-row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        font-size: 30px;
        border: 1px solid black;
    }
</style>
