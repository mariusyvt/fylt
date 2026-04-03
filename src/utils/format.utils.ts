export const parsePreparationTime = (timeStr: string): number => {
    const match = timeStr.match(/^(\d+)h(\d+)?$/);
    if (match) {
        const hours = parseInt(match[1]) || 0;
        const minutes = parseInt(match[2]) || 0;
        return hours * 60 + minutes;
    }
    return 0;
}

