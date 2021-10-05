<script lang="ts">
    import TaskRow from "$lib/TaskRow.svelte"
    import type { Task, TaskId } from "$lib/task"
    import { derived, writable } from "svelte/store"
    import { produce } from "immer"

    const defaultTasks: Task[] = [
        { id: 0 as TaskId, title: "foo" },
        { id: 1 as TaskId, title: "bar" },
        { id: 2 as TaskId, title: "baz" },
    ]
    const tasks = writable(defaultTasks)
    const paddedTasksList = derived(tasks, $tasks => [...$tasks, ...new Array(10 - $tasks.length)])

    function onTaskTitleEdited(event) {
        tasks.update((value) =>
            produce(value, (draft) => {
                draft[event.detail.index].title = event.detail.currentTitle
            }),
        )
    }
</script>

<div class="header-container">
    <h1>Task queue</h1>
</div>

<div class="task-container">
    {#each $paddedTasksList as task, index}
        <TaskRow {task} {index} on:taskTitleEdited={onTaskTitleEdited} />
    {/each}
</div>

<style>
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
