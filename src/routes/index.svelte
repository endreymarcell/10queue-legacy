<script lang="ts">
    import TaskRow from "$lib/TaskRow.svelte"
    import type { Task, TaskId } from "$lib/task"
    const tasks: Task[] = [
        { id: 0 as TaskId, title: "foo" },
        { id: 1 as TaskId, title: "bar" },
        { id: 2 as TaskId, title: "baz" },
    ]
</script>

<svelte:head>
    <title>Marca's 10queue</title>
</svelte:head>

<div class="header-container">
    <h1>Task queue</h1>
</div>

<div class="task-container">
    {#each tasks as task, index}
        <TaskRow {task} {index} />
    {/each}
</div>

<style>
    :global(*) {
        font-family: sans-serif;
    }

    .header-container {
        width: 100%;
        text-align: center;
    }

    .task-container {
        --padding: 50px;
        width: calc(100% - calc(2 * var(--padding)));
        padding: var(--padding);
    }
</style>
