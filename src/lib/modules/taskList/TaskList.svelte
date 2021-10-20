<script lang="ts">
    import TaskRow from "$lib/modules/taskList/TaskRow.svelte"
    import { onMount } from "svelte"
    import { derived } from "svelte/store"
    import { appState } from "$lib/logic"
    import { setupKeyboardShortcuts } from "./keyboardShortcuts"
    import Actions from "./Actions.svelte"

    const paddedTasksList = derived(appState, $appState =>
        $appState.isRunning ? [$appState.tasks[0]] : [...$appState.tasks, ...new Array(10 - $appState.tasks.length)],
    )

    onMount(() => setupKeyboardShortcuts())
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
