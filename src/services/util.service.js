function time(time) {
    const minutes = (Math.floor(time / 60000)) + '';
    const seconds = (Math.floor((time % 60000) / 1000)) + '';
    return `${minutes.padStart(2, ' ')}:${seconds.padStart(2, '0')}`;
}

function getRandomId() {
    const letters = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    const max = letters.length;
    let key = '';
    for (let i = 0; i < 15; i++) {
        let idx = Math.floor(Math.random() * max);
        key += letters[idx];
    }
    return key;
}

export const utilService = {
    getRandomId,
    time
}