<script lang="ts">
    import TaskRow from "$lib/modules/taskList/TaskRow.svelte"
    import { derived } from "svelte/store"
    import { appState } from "$lib/logic"
    import Actions from "./Actions.svelte"
    import type { Task } from "$lib/modules/taskList/tasks"

    export let tasks: Task[] = []

    const paddedTasksList = derived(appState, $appState =>
        $appState.isRunning ? [tasks[0]] : [...tasks, ...new Array(10 - tasks.length)],
    )
</script>

<Actions />
<div class="task-container">
    {#each $paddedTasksList as task, index}
        <TaskRow {task} {index} />
    {/each}
</div>

<style>
    .task-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }
</style>
