import EventEmitter from '@byungi/event-emitter'

import add from '.'

test('basic', () => {
    const ee = new EventEmitter<{a(): void}>()
    const f = jest.fn()
    const clearAll = add(ee, 'a', f)

    ee.emit('a')
    expect(f).toBeCalledTimes(1)

    clearAll()
    ee.emit('a')
    expect(f).toBeCalledTimes(1)
})

test('chain', () => {
    const ee = new EventEmitter<{a(): void}>()
    const f = jest.fn()
    const clearAll = add(ee, 'a', f)
        .add(ee, 'a', f)
        .add(ee, 'a', f)

    ee.emit('a')
    expect(f).toBeCalledTimes(3)

    clearAll()
    ee.emit('a')
    expect(f).toBeCalledTimes(3)
})

test('check listenable', () => {
    expect(() => add(new EventEmitter(), 'a', () => {})).not.toThrow()
    expect(() => add({} as any, 'a', () => {})).toThrow('`Add Listener` method was not found.')
})

test('lazy add(init without args)', () => {
    const clearAll = add()
    const ee = new EventEmitter<{a(): void}>()
    const f = jest.fn()
    clearAll.add(ee, 'a', f)
    ee.emit('a')
    clearAll()
    ee.emit('a')
    expect(f).toBeCalledTimes(1)
})

test.skip('type', () => {
    const ee = new EventEmitter()
    const ws = new WebSocket('')
    const xhr = new XMLHttpRequest()

    add(window, 'click', e => e.altKey)
        .add(document, 'readystatechange', e => e.stopPropagation)
        .add(document.createElement('div'), 'click', e => e.altKey)
        .add(document.createElement('video'), 'click', e => e.altKey)
        .add(ee, 'test', () => {})
        .add(ws, 'message', () => {})
        .add(xhr, 'readystatechange', () => {})
})
