<script lang="ts">
    import type { Task } from "$lib/tasks"
    import TaskDetails from "$lib/TaskDetails.svelte"
    import TaskPlaceholder from "$lib/TaskPlaceholder.svelte"

    export let index: number

    export let task: Task
</script>

<div class="task-row">
    {#if task !== undefined}
        <TaskDetails {index} {task} on:taskTitleEdited />
    {:else}
        <TaskPlaceholder {index} />
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
