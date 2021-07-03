import * as Colyseus from 'colyseus.js'
import { useEffect, useState } from 'react'

let room: Colyseus.Room
let client: Colyseus.Client
let gameDisplay: HTMLCanvasElement = null

type Prop<T> = {
    [P: string]: T
}

type Position = {
    x: number
    y: number
}
interface Player {
    id: string
    position: Position
    color: string
}

type ClientState = {
    inRoom: boolean
    players?: Prop<Player>
    client_id: string | null
}

export default function MainGame() {
    client = new Colyseus.Client('ws://localhost:2567')
    const [clientState, changeClientState] = useState<ClientState>({
        inRoom: false,
        client_id: null,
        players: {
            asdasd: {
                color: 'blue',
                id: 'asdasd',
                position: { x: 10, y: 10 },
            },
        },
    })

    useEffect(() => {
        if (clientState.inRoom === true) {
            gameDisplay = document.getElementById(
                'gamedisplay'
            ) as HTMLCanvasElement
            let ctx = gameDisplay.getContext('2d')
            // ctx.clearRect(0, 0, 800, 800)

            Object.keys(clientState.players).forEach((player) => {
                console.log(player, clientState.players[player])
                let playerAvatar = clientState.players[player]
                ctx.fillStyle = playerAvatar.color
                ctx.fillRect(
                    playerAvatar.position.x,
                    playerAvatar.position.y,
                    10,
                    10
                )
            })

            //document.addEventListener('keydown', logKey)
            document.addEventListener('keydown', (e) => {
                changeClientState({
                    ...clientState,
                    players: {
                        asdasd: {
                            id: 'asdasd',
                            color: 'blue',
                            position: {
                                x:
                                    clientState.players['asdasd'].position.x +
                                    20,
                                y:
                                    clientState.players['asdasd'].position.y +
                                    20,
                            },
                        },
                    },
                })
                ctx.fillStyle = clientState.players['asdasd'].color
                ctx.fillRect(
                    clientState.players['asdasd'].position.x + 20,
                    clientState.players['asdasd'].position.y + 20,
                    10,
                    10
                )
            })
        }
    }, [clientState.inRoom, clientState.players['asdasd'].position])

    if (clientState.inRoom === true) {
        return (
            <div>
                <div style={{ border: '1px solid black' }}>
                    <canvas id="gamedisplay"></canvas>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <button
                    onClick={async () => {
                        try {
                            room = await client.joinOrCreate('MyRoom', {
                                /* options */
                            })
                            changeClientState({
                                ...clientState,
                                inRoom: true,
                                client_id: room.sessionId,
                            })
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
                            changeClientState({
                                ...clientState,
                                inRoom: false,
                                client_id: null,
                            })
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
}
