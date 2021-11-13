<script lang="ts">
    import { appState } from "$lib/logic"

    let stringifiedState = ""
    appState.subscribe(state => {
        stringifiedState = JSON.stringify(state, null, 2)
    })
</script>

<div class="state-inspector">
    <pre>
      {stringifiedState}
    </pre>
</div>

<style>
    .state-inspector {
        width: 400px;
        position: absolute;
        bottom: 50px;
        right: 50px;
        background: white;
        padding: 10px;
        border-radius: 10px;
    }

    pre {
        font-family: "Fira Code", Courier, monospace;
        font-size: 9pt;
    }
</style>
