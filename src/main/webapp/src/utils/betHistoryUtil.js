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
    const firstHalfText = firstHalfOnly ? 'Hiệp 1 - ' : ''
    return `${firstHalfText}${parsedEvent}`
}

export {parseBetEvent}