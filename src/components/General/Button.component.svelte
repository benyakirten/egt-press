<script lang="ts">
	export let disabled = false;
	export let type: ButtonType = 'button';
</script>

<button {disabled} {type} class="button" on:click>
    <div />
    <span>
        <slot />
    </span>
</button>

<style lang="scss">
    .button {
        position: relative;
        padding: 0.5rem 1rem;
        margin: 0.5rem 2px;
        
        outline: 2px solid #000;
        
        overflow: hidden;

        span {
            position: relative;
            z-index: 1;
        }

        div {
            position: absolute;

            background-color: #000;

            top: 0;
            left: 0;
            width: 200%;
            height: 200%;

            clip-path: polygon(0 0, 0% 100%, 100% 0%);

            transform-origin: top left;
            transition: all 1s;
            transform: scale(0);
        }

        &:hover > span {
            color: #fff;
        }
        &:hover > div {
            transform: scale(1);
        }

        &:disabled {
            cursor:not-allowed;

            outline: 2px solid #888;
            color: #888;

            &:hover > span {
                color: #888;
            }
            
            &:hover > div {
                transform: scale(0);
            }
        }
    }
</style>
