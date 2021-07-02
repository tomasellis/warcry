import * as Colyseus from 'colyseus.js'

export default function MainGame() {
    const client = new Colyseus.Client('ws://localhost:2567')
    let room: Colyseus.Room
    return (
        <div>
            <div>
                <canvas></canvas>
            </div>
            <button
                onClick={async () => {
                    try {
                        room = await client.joinOrCreate('MyRoom', {
                            /* options */
                        })
                        console.log('joined successfully', room)
                    } catch (e) {
                        console.error('JOIN ERROR:', e)
                    }
                }}
            >
                Join room
            </button>
            <button
                onClick={async () => {
                    try {
                        room.leave()
                        console.log('left successfully', room)
                    } catch (e) {
                        console.error('LEAVE ERROR:', e)
                    }
                }}
            >
                Leave room
            </button>
        </div>
    )
}
