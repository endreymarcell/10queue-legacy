<script lang="ts">
    import { appLogic } from "$lib/logic"
    import { dispatch } from "$lib/logicHelpers"
    import { onClickOutside } from "$lib/onClickOutside"

    export let isOpen: boolean

    const handleClickedOutside = () => dispatch(appLogic.clickedOutside.action())
</script>

{#if isOpen}
    <div class="help-modal-overlay">
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
                <li><span class="shortcut">j</span>move down</li>
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
        height: 50vh;
        margin-top: 20vh;
        background: gold;
        border: 3px solid white;
        border-radius: 30px;
        padding: 30px;
    }
</style>
