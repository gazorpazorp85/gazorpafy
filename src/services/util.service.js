function time(time) {
    const minutes = (Math.floor(time / 60000)) + '';
    const seconds = (Math.floor((time % 60000) / 1000)) + '';
    return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
}

export const utilService = {
    time
}