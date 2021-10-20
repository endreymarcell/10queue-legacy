<script lang="ts">
    import type { Task } from "$lib/modules/taskList/tasks"
    import TaskDetails from "$lib/modules/taskList/TaskDetails.svelte"
    import CreateNewTaskSign from "$lib/modules/taskList/CreateNewTaskSign.svelte"
    import { appState } from "$lib/logic"

    export let index: number
    export let task: Task
</script>

<div class="task-row">
    {#if task !== undefined}
        <TaskDetails {index} {task} />
    {:else if index === $appState.tasks.length && !$appState.isRunning && !$appState.isEditingTaskTitle}
        <CreateNewTaskSign {index} />
    {/if}
</div>

<style>
    .task-row {
        --task-height: 40px;
        --task-border-radius: 25px;

        position: relative;
        width: 100%;
        height: var(--task-height);
        display: flex;
        justify-content: space-between;
        font-size: 30px;
        margin-bottom: 30px;
        background: darksalmon;
        border-radius: var(--task-border-radius);
    }
</style>
