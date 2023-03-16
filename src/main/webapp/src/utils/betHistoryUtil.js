import {BET_RESULT} from "../common/Constant";

const parseBetEvent = (betHistory) => {
    const {event, firstHalfOnly} = betHistory;
    const parsedEvent = event
        .replace("Handicap 1", betHistory.firstTeam)
        .replace("Handicap 2", betHistory.secondTeam)
        .replace("W1", `${betHistory.firstTeam} (-0.5)`)
        .replace("W2", `${betHistory.secondTeam} (-0.5)`)
        .replace("1X", `${betHistory.firstTeam} (+0.5)`)
        .replace("2X", `${betHistory.secondTeam} (+0.5)`)
        .replace("Total Over", "Tài")
        .replace("Total Under", "Xỉu")
    const firstHalfText = firstHalfOnly ? 'Hiệp 1: ' : ''
    return `${firstHalfText}${parsedEvent}`
}

const filterBetResult = (betHistoryList, resultToFilter) => {
    return betHistoryList.filter(ele => resultToFilter.includes(ele.result))
}

const resultToText = (result) => {
    switch (result) {
        case BET_RESULT.NOT_FINISHED:
            return `Chưa Hoàn Tất`
        case BET_RESULT.WIN:
            return `Thắng`
        case BET_RESULT.HALF_WIN:
            return `Thắng Nửa Tiền`
        case BET_RESULT.LOST:
            return `Thua`
        case BET_RESULT.HALF_LOST:
            return `Thua Nửa Tiền`
        case BET_RESULT.DRAW:
            return `Hoà`
        default:
            return result
    }
}

export {filterBetResult, parseBetEvent, resultToText}