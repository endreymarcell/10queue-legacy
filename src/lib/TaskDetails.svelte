<script lang="ts">
    import type { Task } from "$lib/task"

    export let index: number
    export let task: Task
</script>

<div class="task-details">
    <div class="task-description">
        <div>{index}.</div>
        <div>{task.title}</div>
    </div>
    <div class="task-actions">
        <div>Edit</div>
        <div>Delete</div>
    </div>
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
