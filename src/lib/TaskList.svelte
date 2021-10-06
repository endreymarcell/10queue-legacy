<script lang="ts">
    import TaskRow from "$lib/TaskRow.svelte"
    import { onMount } from "svelte"
    import { derived } from "svelte/store"
    import { setupKeyboardShortcuts } from "./keyboardShortcuts"
    import { state } from "./state"

    const paddedTasksList = derived(state, $state =>
        $state.isRunning ? [$state.tasks[0]] : [...$state.tasks, ...new Array(10 - $state.tasks.length)],
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
