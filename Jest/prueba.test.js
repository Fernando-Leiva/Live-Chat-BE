const {addMessage,clearMessages,getMessages} = require('../src/utilities')


test('returns an array type when getting messages', () => {
    expect(getMessages()).toBeInstanceOf(Array)
})

test('appends new object to message history', () => {
    const message = {
        usuario:'Usuario test',
        message:'Mensaje de prueba'
    }
    addMessage(message)
    expect(getMessages()).toContain(message)
})

test('clears message history', () => {
    clearMessages()
    expect(getMessages()).toStrictEqual([])
})
