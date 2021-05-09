import wave, { clearEffect } from './wave'

const sleep = () => new Promise((resolve) => global.setTimeout(resolve, 20))

describe('wave effect', () => {
  let btn: HTMLButtonElement
  beforeEach(() => {
    btn = document.createElement('button')
    document.body.appendChild(btn)
  })
  afterEach(() => {
    clearEffect(btn)
    document.body.removeChild(btn)
    btn = null as any
  })

  test('should trigger wave effect when click', async () => {
    wave(btn)
    btn.click()
    await sleep()
    expect(btn.hasAttribute('wave-click-animating')).toBe(true)
    expect(btn.getAttribute('wave-click-animating')).toBe('true')
  })

  test('should mark effect end after animation end', async () => {
    wave(btn)
    btn.click()
    await sleep()
    btn.dispatchEvent(new Event('animationend'))
    expect(btn.getAttribute('wave-click-animating')).toBe('true')
    btn.dispatchEvent(Object.assign(new Event('animationend'), { animationName: 'fadeEffect' }))
    await sleep()
    expect(btn.getAttribute('wave-click-animating')).toBe('false')
  })

  test('should filter disable class', async () => {
    btn.classList.add('btn-disabled')
    wave(btn, {
      disabledClass: ['btn-disabled'],
    })
    btn.click()
    await sleep()
    expect(btn.getAttribute('wave-click-animating')).toBe('false')
  })

  test('should not trigger effect if clear effect', async () => {
    wave(btn)
    clearEffect(btn)
    btn.click()
    await sleep()
    expect(btn.hasAttribute('wave-click-animating')).toBeFalsy()
  })

  test('should not initial wave if element is null', async () => {
    const jestConsole = jest.spyOn(console, 'warn')
    wave(null as any)
    expect(jestConsole).toBeCalledWith('wave element is invalidate')
  })
})
