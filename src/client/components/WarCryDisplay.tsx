import * as Colyseus from 'colyseus.js'
import { ReactNode, useEffect, useState } from 'react'
import { WarCryGameState } from '../../server/src/rooms/schema/WarCryGameState'

import { Player } from '../../server/src/rooms/schema/Player'
import { Board } from '../../server/src/rooms/schema/Board'

let room: Colyseus.Room<WarCryGameState>
let gameDisplay: HTMLCanvasElement = null

type ClientState = {
    inRoom: boolean
    players?: Map<string, Player>
    clientId?: string
    intervalId: NodeJS.Timeout | null
    boardRows: number | null
    boardCols: number | null
    boardColors: string[] | null
    boardSquares: JSX.Element[] | null
}

export default function MainGame() {
    const client = new Colyseus.Client('ws://localhost:2567')

    const [clientState, setClientState] = useState<ClientState>({
        inRoom: false,
        clientId: null,
        players: new Map(),
        intervalId: null,
        boardRows: null,
        boardColors: null,
        boardCols: null,
        boardSquares: null,
    })

    useEffect(() => {
        drawGrid(clientState.boardColors)
        if (room !== undefined && clientState.inRoom === true) {
            /* gameDisplay = document.getElementById(
                'gameDisplay'
            ) as HTMLCanvasElement
            gameDisplay.height = 500
            gameDisplay.width = 700
            let ctx = gameDisplay.getContext('2d')
            ctx.clearRect(0, 0, 800, 800)
            */
            document.addEventListener('keydown', (e) => {
                room.send('playerInput', e.code)
            })

            room.onMessage('devInfo', (msg) => {
                console.log('devInfo', msg)
            })

            room.onStateChange((newState) => {
                setClientState({
                    ...clientState,
                    players: newState.players,
                    boardColors: newState.board.colors,
                    boardCols: newState.board.cols,
                    boardRows: newState.board.rows,
                })
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

    const drawGrid = (colors: string[]) => {
        console.info('board aint null')
        let squareColors = colors
        let updatedColors = squareColors.map((el, index) => (
            <div
                className="gridSquare"
                style={{ backgroundColor: `${el}` }}
                key={index}
            ></div>
        ))
        setClientState({ ...clientState, boardSquares: updatedColors })
    }

    const randomColor = () => Math.floor(Math.random() * 16777215).toString(16)

    const printPlayersName = (players: Map<string, Player>) => {
        let names = []
        for (let key of players.keys()) {
            names.push(key)
            console.log(randomColor())
        }
        return names.map((name, index) => (
            <div style={{ color: `#${randomColor()}` }} key={index}>
                Player {1 + index + ': ' + name}
            </div>
        ))
    }

    if (clientState.inRoom === true) {
        if (clientState.intervalId === null) {
            const id = setInterval(drawPlayers, 2000)
            setClientState({ ...clientState, intervalId: id })
        }
        return (
            <div id="gameDisplay">
                {clientState.players !== undefined ? (
                    printPlayersName(clientState.players)
                ) : (
                    <span>F</span>
                )}
                <div className="grid">{clientState.boardSquares}</div>
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
