<script lang="ts">
    import type { Task } from "$lib/taskList/tasks"
    import TaskDetails from "$lib/taskList/TaskDetails.svelte"

    export let index: number
    export let task: Task
</script>

<div class="task-row">
    {#if task !== undefined}
        <TaskDetails {index} {task} />
    {/if}
</div>

<style>
    .task-row {
        --task-height: 40px;
        --task-border-radius: 25px;

        width: 100%;
        height: var(--task-height);
        display: flex;
        justify-content: space-between;
        font-size: 30px;
        margin-bottom: 20px;
        background: darksalmon;
        border-radius: var(--task-border-radius);
    }
</style>
