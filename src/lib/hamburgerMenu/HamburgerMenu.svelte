<script lang="ts">
    let isOpen = false
</script>

<div class="hamburger-menu">
    <span class="closed-symbol" on:click={() => (isOpen = !isOpen)}>•••</span>
    <div class="menu-items-container" class:hidden={!isOpen}>
        <slot />
    </div>
</div>

<style>
    .menu-items-container {
        position: absolute;
        z-index: 1;
        top: 30px;
        right: 0;
        background: var(--page-background);
        border: 3px solid black;
        padding: 10px;
        border-radius: 50px;
        display: flex;
        flex-direction: column;
    }

    .hidden {
        display: none;
    }
</style>
