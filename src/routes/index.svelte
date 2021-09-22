<script lang="ts">
    import TaskRow from "$lib/TaskRow.svelte"
    import type { Task, TaskId } from "$lib/task"
    let tasks: Task[] = [
        { id: 0 as TaskId, title: "foo" },
        { id: 1 as TaskId, title: "bar" },
        { id: 2 as TaskId, title: "baz" },
    ]
    let paddedTasksList = []
    $: paddedTasksList = [...tasks, ...new Array(10 - tasks.length)]
</script>

<svelte:head>
    <title>Marca's 10queue</title>
</svelte:head>

<div class="header-container">
    <h1>Task queue</h1>
</div>

<div class="task-container">
    {#each paddedTasksList as task, index}
        <TaskRow {task} {index} />
    {/each}
</div>

<style>
    :global(*) {
        font-family: sans-serif;
    }

    :global(html, body) {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }

    :global(#svelte) {
        width: 100%;
        height: 100%;
    }

    .header-container {
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .task-container {
        --padding: 50px;
        width: calc(100% - 2 * var(--padding));
        height: calc(100% - 2 * var(--padding) - 100px);
        padding: var(--padding);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>
