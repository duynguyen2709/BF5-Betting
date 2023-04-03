import {useContext} from 'react'
import PlayersContext from "../common/PlayersContext";

const usePlayerContextHook = () => {
    const playerContext = useContext(PlayersContext)
    const {players, fetchPlayersData} = playerContext
    return {players, fetchPlayersData}
}

export default usePlayerContextHook