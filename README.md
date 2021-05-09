# wave-effect

click wave effect with CSS animation.

## Install

```bash
npm install wave-effect
```

```bash
yarn add wave-effect
```

# Usage

```javascript
import wave,{ clearEffect } from 'wave-effect'
import 'wave-effect/dist/wave.css'

const button = document.getElementById("button")

wave(button)

// clear effect
clearEffect(button)
```

## API

```javascript
wave(element: Element, options?: WaveOptions)
```

**WaveOptions**

```typescript
interface WaveOptions {
  // current wave effect color
  waveColor?: string 
  // if element includes these className, click doesn't trigger effect
  disabledClass?: string[] 
}
```

## Customize Style

you can override less variables to customize style.

```less
@import "~wave-effect/src/wave.less";

@wave-color: red;
@wave-animation-width: 20px;
```

or use css variables.

```css
:root {
  --wave-shadow-color: red;
  --wave-animation-width: 20px;
}
```



## Licence

MIT