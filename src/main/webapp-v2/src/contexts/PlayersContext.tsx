import React from 'react'

export interface Player {
  [key: string]: any
}

export interface PlayersContextType {
  players: Player
  fetchPlayersData: () => void
}

export const PlayersContext = React.createContext<PlayersContextType>({
  players: {},
  fetchPlayersData: () => {}
})

export const usePlayersContext = () => React.useContext(PlayersContext)
