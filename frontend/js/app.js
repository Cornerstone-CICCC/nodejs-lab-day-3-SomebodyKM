const socket = io("http://localhost:3500")

const roomSelect = document.getElementById('room-select')
const usernameInput = document.getElementById('username')
const messages = document.getElementById('messages')
const btnJoin = document.getElementById('btn-join')
const chatForm = document.getElementById('chat-form')
const chatInput = document.getElementById('chat-message')

let currentRoom = null

// Join room
btnJoin.addEventListener('click', function () {
    const username = usernameInput.value
    const selectedRoom = roomSelect.value

    if (!username) {
        alert("Enter username first!")
        return
    }

    if (currentRoom) {
        // Leave the previous room
        socket.emit("leaveRoom", {
            room: currentRoom
        })
        messages.innerHTML = ""
    }

    currentRoom = selectedRoom

    socket.emit('joinRoom', {
        room: selectedRoom,
        username
    })

    socket.emit("getRoomMessages", { room: currentRoom })
    usernameInput.disabled = true
})

// Load previous messages
socket.on("loadRoomMessages", msgs => {
    messages.innerHTML = ""
    msgs.forEach(msg => {
        addMessage(msg.username, msg.message)
    })
})

// Send chat
chatForm.addEventListener('submit', e => {
    e.preventDefault()

    const username = usernameInput.value.trim()
    const message = chatInput.value.trim()

    if (!currentRoom) {
        alert("Join a room first!")
        return
    }

    if (!username || !message || !currentRoom) return

    socket.emit("sendMessage", {
        username,
        message,
        room: currentRoom
    })

    chatInput.value = ""
})

// Receive new messages
socket.on("newMessage", (data) => {
    addMessage(data.username, data.message)
})

// Helper
function addMessage(username, message) {
    const li = document.createElement('li')
    li.innerHTML = `<span>${username}</span>: ${message}`
    messages.appendChild(li)
}