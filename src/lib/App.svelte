<script lang="ts">
    import { onMount } from "svelte"
    import compare from "just-compare"
    import Header from "./modules/header/Header.svelte"
    import TaskList from "./modules/taskList/TaskList.svelte"
    import { appLogic, appState } from "$lib/logic"
    import { DEFAULT_PAGE_TITLE } from "$lib/helpers/const"
    import HelpModal from "./modules/help/HelpModal.svelte"
    import { dispatch } from "$lib/logical/logicHelpers"
    import type { Task } from "$lib/modules/taskList/tasks"

    onMount(() => {
        dispatch(appLogic.onMount.action(initialState))
    })

    export let initialState: null
    let tasks: Task[] = []
    $: {
        // This horrible workaround clearly shows that I'm using Svelte wrong.
        const currentTasks = $appState.hasMounted ? $appState.tasks : initialState.tasks
        const haveTasksChanged = !compare(currentTasks, tasks)
        if (haveTasksChanged) {
            tasks = currentTasks
        }
    }
</script>

<svelte:head>
    <title>{DEFAULT_PAGE_TITLE}</title>
</svelte:head>

<div class="outer-container">
    <div class="inner-container">
        <Header />
        <!-- Without the #key block, changes get stuck and are only applied on the next render. -->
        <!-- I'm clearly doing something wrong. -->
        {#key tasks}
            <TaskList {tasks} />
        {/key}
    </div>
</div>
<HelpModal isOpen={$appState.isHelpModalOpen} />

<style>
    .outer-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: var(--page-background);
    }

    .inner-container {
        width: 100%;
        max-width: 1000px;
    }

    @media screen and (max-width: 700px) {
        .inner-container {
            width: calc(100% - 60px);
        }
    }
</style>
