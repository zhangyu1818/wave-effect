import { updateCSS } from 'dynamic-stylesheet'

export interface WaveOptions {
  waveColor?: string
  disabledClass?: string[]
}

let styleForPseudo: HTMLStyleElement | null

const isHiddenElement = (element: HTMLElement) => {
  if (process.env.NODE_ENV === 'test') {
    return false
  }
  return !element.offsetParent || element.hidden
}

// https://github.com/ant-design/ant-design/blob/master/components/_util/wave.tsx#L18
function isNotGrey(color: string) {
  const match = (color || '').match(/rgba?\((\d*), (\d*), (\d*)(, [\d.]*)?\)/)
  if (match && match[1] && match[2] && match[3]) {
    return !(match[1] === match[2] && match[2] === match[3])
  }
  return true
}

const isValidColor = (color?: string) => {
  return (
    color &&
    color !== '#ffffff' &&
    color !== `rgb(255,255,255)` &&
    isNotGrey(color) &&
    !/rgba\((?:\d*, ){3}0\)/.test(color) &&
    color !== 'transparent'
  )
}

const getWaveColor = (element: HTMLElement) => {
  return (
    getComputedStyle(element).getPropertyValue('border-color') ||
    getComputedStyle(element).getPropertyValue('background-color')
  )
}

const cancelWaveMap = new WeakMap<HTMLElement, () => void>()

const wave = <Element extends HTMLElement>(element: Element, options: WaveOptions = {}) => {
  const { waveColor: optionWaveColor, disabledClass = [] } = options
  if (!element) {
    console.warn('wave element is invalidate')
    return
  }

  let timeoutId: number

  const shouldFilter = () => disabledClass.some((name) => element.className.includes(name))

  const triggerWave = <Element extends HTMLElement>(element: Element, waveColor: string) => {
    if (!element || isHiddenElement(element) || shouldFilter()) {
      return
    }
    element.setAttribute('wave-click-animating', 'true')
    if (isValidColor(waveColor)) {
      const cssText = `
        [wave-click-animating='true']::after {
          --wave-shadow-color: ${waveColor};
        }
      `
      styleForPseudo = updateCSS(cssText, 'wave-animate', { attachTo: document.body })

      element.addEventListener(`animationend`, onWaveEnd)
    }
  }

  const onWaveEnd = (event: AnimationEvent) => {
    if (!event || event.animationName !== 'fadeEffect') {
      return
    }
    resetEffect()
  }

  const resetEffect = () => {
    element.setAttribute('wave-click-animating', 'false')

    if (styleForPseudo) {
      styleForPseudo.innerHTML = ''
    }

    element.removeEventListener(`animationend`, onWaveEnd)
  }

  const internalOnClick = (event: MouseEvent) => {
    const { target } = event
    if (isHiddenElement(target as HTMLElement)) {
      return
    }

    resetEffect()
    const waveColor = getWaveColor(element)

    timeoutId = window.setTimeout(() => triggerWave(element, optionWaveColor ?? waveColor), 0)
  }

  element.addEventListener('click', internalOnClick, true)

  cancelWaveMap.set(element, () => {
    cancelWaveMap.delete(element)
    window.clearTimeout(timeoutId)
    element.removeEventListener('click', internalOnClick, true)
  })
}

const clearEffect = (element: HTMLElement) => {
  const clear = cancelWaveMap.get(element)
  clear?.()
}

export { clearEffect }

export default wave
