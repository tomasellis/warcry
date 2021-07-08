import * as Colyseus from 'colyseus.js'
import { ReactNode, useEffect, useState } from 'react'
import { TetrisGameState } from '../../server/src/rooms/schema/TetrisGameState'
import { Player } from '../../server/src/rooms/schema/Player'
import { Board } from '../../server/src/rooms/schema/Board'

let room: Colyseus.Room<TetrisGameState>
let gameDisplay: HTMLCanvasElement = null

type ClientState = {
    inRoom: boolean
    players?: Map<string, Player>
    clientId?: string
    intervalId: NodeJS.Timeout | null
    boardRows: number | null
    boardCols: number | null
    boardValues: number[] | null
}

export default function Tetris() {
    const client = new Colyseus.Client('ws://localhost:2567')
    const [clientState, setClientState] = useState<ClientState>({
        boardCols: null,
        boardRows: null,
        boardValues: null,
        inRoom: false,
        intervalId: null,
    })
    const gameLoop = () => {}

    const drawPlayers = () => {
        clientState.players.forEach((value, key) => {
            console.log(key, value)
        })
    }

    const drawGrid = (clientState: ClientState) => {
        console.info('board aint null')
        let squares = clientState.boardValues
        return squares.map((el, index) => (
            <div className="gridSquare" key={index}></div>
        ))
    }

    if (clientState.inRoom === true) {
        if (clientState.intervalId === null) {
            const id = setInterval(gameLoop, 2000)
            setClientState({ ...clientState, intervalId: id })
        }
        return (
            <div id="gameDisplay">
                {clientState.players !== undefined ? (
                    printPlayersName(clientState.players)
                ) : (
                    <span>F</span>
                )}
                <div className="grid">{drawGrid(clientState)}</div>
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
                            room = await client.joinOrCreate('TetrisGame', {
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
                    Join Tetris Room
                </button>
            </div>
        )
    }
}

/* ---------------------HELPERS-------------------------------- */

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
