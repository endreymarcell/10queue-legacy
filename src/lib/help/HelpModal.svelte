<script lang="ts">
    export let isOpen: boolean
</script>

{#if isOpen}
    <div class="help-modal-overlay">
        <div class="help-modal">Help comes here</div>
    </div>
{/if}

<style>
    .help-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        align-content: center;
        justify-content: center;
    }

    .help-modal {
        width: 75vw;
        height: 50vh;
        margin-top: 20vh;
        background: gold;
        border: 3px solid white;
        border-radius: 30px;
        padding: 30px;
    }
</style>
