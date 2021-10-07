<script lang="ts">
    import TaskRow from "$lib/taskList/TaskRow.svelte"
    import { onMount } from "svelte"
    import { derived } from "svelte/store"
    import { setupKeyboardShortcuts } from "../keyboardShortcuts"
    import { appState } from "../state"

    const paddedTasksList = derived(appState, $appState =>
        $appState.isRunning ? [$appState.tasks[0]] : [...$appState.tasks, ...new Array(10 - $appState.tasks.length)],
    )

    onMount(() => {
        setupKeyboardShortcuts()
    })
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
