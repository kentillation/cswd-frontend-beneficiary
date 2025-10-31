import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

Pusher.logToConsole = process.env.NODE_ENV === 'development'

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'f2ff9925065555c61de5',
    cluster: 'ap1',
    forceTLS: 'true',
    encrypted: 'true',
    enabledTransports: ['ws', 'wss'],
    enableStats: true,
    logToConsole: true,
    authEndpoint: '/broadcasting/auth', // for local development 
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
    }
})

export default echo