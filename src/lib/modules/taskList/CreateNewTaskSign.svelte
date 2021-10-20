<script lang="ts">
    import { dispatch } from "$lib/helpers/logicHelpers"
    import { appLogic } from "$lib/logic"

    export let index: number
    const handleCreateSignClicked = () => dispatch(appLogic.taskCreateAtIndex.action(index))
</script>

<div class="create-sign" on:click={handleCreateSignClicked}>+</div>

<style>
    .create-sign {
        width: 100%;
        text-align: center;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.05);
        opacity: 0;
        border-radius: 20px;
        color: maroon;
    }

    .create-sign:hover {
        opacity: 1;
    }
</style>
