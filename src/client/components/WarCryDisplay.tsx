import * as Colyseus from 'colyseus.js'
import { useEffect, useState } from 'react'

let room: Colyseus.Room
let client: Colyseus.Client
let gameDisplay: HTMLCanvasElement = null

interface Player {
    x: number
    y: number
    color: string
}

type ClientState = {
    inRoom: boolean
    players?: Map<string, Player>
    clientId?: string
    intervalId: NodeJS.Timeout | null
}

export default function MainGame() {
    client = new Colyseus.Client('ws://localhost:2567')

    const [clientState, setClientState] = useState<ClientState>({
        inRoom: false,
        clientId: null,
        players: new Map(),
        intervalId: null,
    })

    useEffect(() => {
        if (room !== undefined && clientState.inRoom === true) {
            gameDisplay = document.getElementById(
                'gameDisplay'
            ) as HTMLCanvasElement
            let ctx = gameDisplay.getContext('2d')
            ctx.clearRect(0, 0, 800, 800)

            document.addEventListener('keydown', (e) => {
                room.send('playerInput', e.code)
            })

            room.onMessage('devInfo', (msg) => {
                console.log('devInfo', msg)
            })
        } else {
            setClientState({ ...clientState, inRoom: false, clientId: '' })
        }
    }, [clientState.inRoom])

    const drawPlayers = () => {
        clientState.players.forEach((value, key) => {
            console.log(key, value)
        })
    }

    if (clientState.inRoom === true) {
        if (clientState.intervalId === null) {
            const id = setInterval(drawPlayers, 2000)
            setClientState({ ...clientState, intervalId: id })
        }
        return (
            <div>
                <div style={{ border: '1px solid black' }}>
                    <canvas id="gameDisplay"></canvas>
                </div>
                <button
                    onClick={async () => {
                        try {
                            clearInterval(clientState.intervalId)
                            setClientState({
                                ...clientState,
                                inRoom: false,
                                clientId: null,
                                intervalId: null,
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
    } else {
        return (
            <div>
                <button
                    onClick={async () => {
                        try {
                            room = await client.joinOrCreate('WarCryGame', {
                                /* options */
                            })
                            const sessionId = room.sessionId
                            setClientState({
                                ...clientState,
                                inRoom: true,
                                clientId: sessionId,
                            })
                        } catch (e) {
                            console.error('JOIN ERROR:', e)
                        }
                    }}
                >
                    Join room
                </button>
            </div>
        )
    }
}
