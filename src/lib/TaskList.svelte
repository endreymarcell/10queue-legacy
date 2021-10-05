<script lang="ts">
    import TaskRow from "$lib/TaskRow.svelte"
    import { derived } from "svelte/store"
    import { tasks } from "./state"

    const paddedTasksList = derived(tasks, ($tasks) => [...$tasks, ...new Array(10 - $tasks.length)])
</script>

<div class="task-container">
    {#each $paddedTasksList as task, index}
        <TaskRow {task} {index} />
    {/each}
</div>

<style>
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
