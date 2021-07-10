import * as Colyseus from 'colyseus.js'
import { ReactNode, useEffect, useState } from 'react'
import { TetrisGameState } from '../../server/src/rooms/schema/TetrisGameState'
import { Board } from '../../server/src/rooms/schema/Board'
import { TetrisPlayer } from '../../server/src/rooms/schema/Tetris/TetrisPlayer'
import { TetrisBoard } from '../../server/src/rooms/schema/Tetris/TetrisBoard'

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

    /* --------------------------- GAMELOOP --------------------------- */
    room.onStateChange((newState) => {
        setClientState({
            ...clientState,
            boardCols: newState.board.cols,
            boardRows: newState.board.rows,
            boardValues: newState.board.values,
        })
    })

    useEffect(() => {
        drawBoard(
            clientState.boardRows,
            clientState.boardCols,
            clientState.boardValues
        )
    }, [clientState])

    const drawBoard = (
        boardRows: number,
        boardCols: number,
        boardSquareValues: number[]
    ): void => {
        //Get DOM board
        const boardEl = document.getElementById('gameBoard')

        //And its size/bounding box
        const boardRec = boardEl.getBoundingClientRect()

        //Set block height??
        const blockHeight = Math.floor((boardRec.height - 32) / boardRows)

        //Set columns and rows using CSS Grid
        boardEl.style.gridTemplateColumns = `repeat(${boardCols}, ${blockHeight}px)`
        boardEl.style.gridTemplateRows = `repeat(${boardRows}, ${blockHeight}px)`

        //Bare minimum size
        boardEl.style.height = 'fit-content'
        boardEl.style.width = 'fit-content'

        //Get each square value for setting up colors
        const getMeSomeColor = (
            whichRow: number,
            whichCol: number,
            whichValues: number[],
            maxColumns: number
        ): number => {
            return whichValues[whichRow * maxColumns + whichCol] // Divide the array in groups of MaxColumns, the iterate over them
        }
        //Paint board
        for (let row = 0; row < boardRows; ++row) {
            for (let col = 0; col < boardCols; ++col) {
                //Create a square
                const cellDiv = document.createElement('div')
                //Attach to grid
                cellDiv.id = `cell-r${row}-c${col}`
                //Paint it
                cellDiv.style.background = `#${getMeSomeColor(
                    row,
                    col,
                    boardSquareValues,
                    boardCols
                ).toString(16)}`
                //Attach to board
                boardEl.append(cellDiv)
            }
        }
    }

    if (clientState.inRoom === true) {
        return (
            <div id="gameDisplay">
                {clientState.players !== undefined ? (
                    printPlayersName(clientState.players)
                ) : (
                    <span>NoPlayerPrinting</span>
                )}
                <div id="gameBoard"></div>
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
