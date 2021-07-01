import Colyseus from 'colyseus.js'
// ...

let client = new Colyseus.Client('ws://localhost:2567')

const joinOrCreateRoom = async () => {
    try {
        const room = await client.joinOrCreate('battle', {
            /* options */
        })
        console.log('joined successfully', room)
    } catch (e) {
        console.error('join error', e)
    }
}

export default function MainGame() {
    return (
        <div>
            <button onClick={joinOrCreateRoom}>CLickee</button>
        </div>
    )
}
