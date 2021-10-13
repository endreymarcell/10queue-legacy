<script lang="ts">
    import { dispatch } from "$lib/logicHelpers"
    import { appLogic } from "$lib/logic"

    export let index: number
    const handleCreateSignClicked = () => dispatch(appLogic.taskCreateAtIndex.action(index))
</script>

<div class="create-sign-container">
    <hr />
    <div class="create-sign" on:click={handleCreateSignClicked}>+</div>
</div>

<style>
    .create-sign-container {
        --width: 30%;
        width: var(--width);
        margin: 0 calc(50% - var(--width) / 2);
        height: 20px;
        position: absolute;
        top: -28px;
        font-size: 15px;
        opacity: 0;
        cursor: pointer;
        text-align: center;
    }

    hr {
        border-color: black;
    }

    .create-sign-container:hover {
        opacity: 1;
    }

    .create-sign {
        margin-top: -18px;
    }
</style>
