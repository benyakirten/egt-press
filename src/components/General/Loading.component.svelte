<script lang="ts">
    export let size = '1.5rem';
    export let color = '#000';
    export let speed = '1200ms';

    $: regexSizeMatch = size.match(/(\d+\.?\d?)(\w+)/);
    $: parsedSize = +regexSizeMatch[1];
    $: parsdSizeUnit = regexSizeMatch[2];
    $: smallSize = `${+(parsedSize * 0.1).toFixed(2)}${parsdSizeUnit}`;

    $: regexSpeedMatch = speed.match(/(\d+\.?\d?)(\w+)/);
    $: parsedSpeed = +regexSpeedMatch[1]
    $: parsedSpeedUnit = regexSpeedMatch[2];

    function getSize() {
        return `height: ${+(parsedSize).toFixed(2)}${parsdSizeUnit}; width: ${+(parsedSize).toFixed(2)}${parsdSizeUnit};`;
    }

    function getAnimationProps(position: number) {
        const animation = `animation: loading ${speed} cubic-bezier(0.5, 0, 0.5, 1) infinite;`;
        const animationDelay = `animation-delay: ${parsedSpeed * 0.125 * position}${parsedSpeedUnit};`;
        return position === 4 ? `${animation}` : `${animation} ${animationDelay}`;
    }

    function getLoaderProps(position: number) {
        const size = getSize();
        const margin = `margin: ${smallSize};`;
        const border = `border: ${smallSize} solid ${color};`
        const borderColor = `border-color: ${color} transparent transparent transparent;`;
        const animationProps = getAnimationProps(position);
        return `${size} ${margin} ${border} ${borderColor} ${animationProps}`;
    }
</script>

<span class="loading" style={getSize()}>
    <div style={getLoaderProps(1)} />
    <div style={getLoaderProps(2)} />
    <div style={getLoaderProps(3)} />
    <div style={getLoaderProps(4)} />
</span>

<style lang="scss" global>
.loading {
  display: inline-block;
  position: relative;
  div {
    position: absolute;
    border-radius: 50%;
  }
}
@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>