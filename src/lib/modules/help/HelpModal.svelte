<script lang="ts">
    import { appLogic } from "$lib/logic"
    import { dispatch } from "$lib/logical/logicHelpers"
    import { onClickOutside } from "$lib/helpers/onClickOutside"
    import { fade } from "svelte/transition"

    export let isOpen: boolean

    const handleClickedOutside = () => dispatch(appLogic.closeHelpModalRequested.action())

    // TODO this should probably be auto-generated, otherwise it'll keep going out of sync
    const shortcuts = [
        ["?", "show this help modal"],
        ["j", "select next task"],
        ["k", "select previous task"],
        ["o", "create new task below"],
        ["O", "create new task above"],
        ["c", "change task description"],
        ["d", "delete task"],
        ["J", "move task down"],
        ["K", "move task up"],
        ["u", "undo"],
        ["U", "redo"],
        ["<Space>", "start/stop working"],
        ["<Enter>", "finish task"],
    ]
</script>

{#if isOpen}
    <div class="help-modal-overlay" transition:fade={{ duration: 30 }}>
        <!-- Note: TS doesn't know about the on:clickedOutside prop -->
        <div class="help-modal" use:onClickOutside on:clickedOutside={handleClickedOutside}>
            <h1>10queue</h1>

            <h2>About</h2>
            <p>
                Conventional todo-lists are very useful. They are also annoying and stressful as they often tend to have
                many more tasks than you could hope to finish in a realistic amount of time, and tasks seem to linger
                around which first cause you stress, than fatigue.
            </p>
            <p>
                10queue is not a todo-list. If anything, it's a <i>doing</i>-list. It only holds a few items - 10 at max
                - and you should really only list the tasks that you actually plan to do that day. To that end, it
                automatically empties itself at midnight.
            </p>
            <p>
                10queue is not trying to help you collect and remember all the things you need to do. That list is too
                big anyway. What it does is it helps you narrow that down to a handful of items that you can actually
                hope to get to, it helps you put them in a priority order, and it helps you focus on one of them - a
                single one. The most important one.
            </p>

            <h2>Keyboard shortcuts</h2>
            <ul>
                {#each shortcuts as [key, name]}
                    <li><span class="shortcut">{key}</span>{name}</li>
                {/each}
            </ul>
        </div>
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
        width: 50vw;
        margin-top: 5rem;
        background: gold;
        border: 3px solid white;
        border-radius: 30px;
        padding: 30px;
    }

    span.shortcut {
        font-family: "Courier New", Courier, monospace;
        background: lightgrey;
        margin-right: 1rem;
        padding: 0.2rem;
    }
</style>
