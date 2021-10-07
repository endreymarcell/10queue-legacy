<script lang="ts">
    export let index: number
    let displayIndex: number
    $: displayIndex = index + 1
</script>

<div class="task-placeholder">
    <div class="task-index">{displayIndex}.</div>
    <div>I am just a placeholder</div>
</div>

<style>
    .task-placeholder {
        display: flex;
        width: 100%;

        font-size: 30px;
    }

    .task-index {
        margin-right: 20px;
    }
</style>
