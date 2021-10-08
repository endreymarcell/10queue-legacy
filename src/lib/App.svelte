<script lang="ts">
    import { onMount } from "svelte"
    import Header from "./header/Header.svelte"
    import TaskList from "./taskList/TaskList.svelte"
    import { setupKeyboardShortcutListener } from "./keyboardShortcuts/logic"

    onMount(() => setupKeyboardShortcutListener())
</script>

<Header />
<TaskList />
