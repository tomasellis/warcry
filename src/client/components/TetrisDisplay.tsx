import * as Colyseus from 'colyseus.js'
import { ReactNode, useEffect, useState } from 'react'
import { TetrisGameState } from '../../server/src/rooms/schema/TetrisGameState'
import { Board } from '../../server/src/rooms/schema/Board'
import { TetrisPlayer } from '../../server/src/rooms/schema/Tetris/TetrisPlayer'

let room: Colyseus.Room<TetrisGameState>
let gameDisplay: HTMLCanvasElement = null

type ClientState = {
    inRoom: boolean
    players?: Map<string, TetrisPlayer>
    clientId?: string
    intervalId: NodeJS.Timeout | null
    boardRows: number | null
    boardCols: number | null
    boardValues: number[] | null
}

export default function TetrisGame() {
    const client = new Colyseus.Client('ws://localhost:2567')
    const [clientState, setClientState] = useState<ClientState>({
        boardCols: null,
        boardRows: null,
        boardValues: null,
        inRoom: false,
        intervalId: null,
    })

    useEffect(() => {
        if (clientState.inRoom === true) {
            room.onMessage('devInfo', (msg) => console.info(msg))
            room.onStateChange((newState) => {
                setClientState({
                    ...clientState,
                    boardCols: newState.board.cols,
                    players: newState.players,
                    boardRows: newState.board.rows,
                    boardValues: newState.board.values,
                })
            })
        }
    }, [clientState])

    const gameLoop = () => {}

    const drawPlayers = () => {
        clientState.players.forEach((value, key) => {
            console.log(key, value)
        })
    }

    const drawGrid = (boardValues: number[]) => {
        console.info('board aint null')
        return boardValues.map((el, index) => (
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
                <div className="grid">
                    {clientState.boardValues !== null ? (
                        drawGrid(clientState.boardValues)
                    ) : (
                        <span>f</span>
                    )}
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
                            room = await client.joinOrCreate('TetrisGame')
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

const printPlayersName = (players: Map<string, TetrisPlayer>) => {
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
