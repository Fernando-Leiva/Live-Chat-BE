
let messages = []

function addMessage (message){
    messages.push(message)
}
function clearMessages () {
    messages = []
}
function getMessages(){
    return messages
}
module.exports = {
    getMessages,
    addMessage,
    clearMessages
}