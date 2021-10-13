<script lang="ts">
    import TaskRow from "$lib/taskList/TaskRow.svelte"
    import { onMount } from "svelte"
    import { derived } from "svelte/store"
    import { appState } from "$lib/logic"
    import { setupKeyboardShortcuts } from "./keyboardShortcuts"

    const paddedTasksList = derived(appState, $appState =>
        $appState.isRunning ? [$appState.tasks[0]] : [...$appState.tasks, ...new Array(10 - $appState.tasks.length)],
    )

    onMount(() => setupKeyboardShortcuts())
</script>

<div class="task-container">
    {#each $paddedTasksList as task, index}
        <TaskRow {task} {index} />
    {/each}
</div>

<style>
    .task-container {
        --vpadding: 40px;
        width: calc(100% - 2 * var(--vpadding));
        padding: 0 var(--vpadding);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>
