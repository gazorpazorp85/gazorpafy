import { spotifyService } from './spotify.service';

let gInterval = null;

function createEventHandlers(player, dispatch, commit) {
    player.on('initialization_error', e => console.error(e));
    player.on('authentication_error', e => console.error(e));
    player.on('account_error', e => console.error(e));
    player.on('playback_error', e => console.error(e));

    // Playback status updates

    player.on('player_state_changed', newState => dispatch({ type: 'updateState', newState }));

    // Ready
    player.on('ready', data => {
        const { device_id } = data;
        console.log('Let the music play on!');
        console.log('Connected with Device ID', device_id);
        commit({ type: 'deviceId', deviceId: device_id });
        _transferPlayback(device_id);
    });

    // player.on('gazorpa_play', _ => {
    //     console.log('listening play');
    // })
}

async function _transferPlayback(device_id) {
    try {
        await spotifyService.transferPlayback(device_id);
    } catch (err) {
        console.log('cannot transfer playback', err);
    }
}

function play(playerState, position, cb) {
    if (gInterval) clearInterval(gInterval);
    let newPosition = position;
    if (!playerState.playing) {
        gInterval = setInterval(() => {
            newPosition = parseInt(newPosition) + 1000;
            cb(newPosition);
        }, 1000);
    } else {
        clearInterval(gInterval);
    }
}

export const playerService = {
    createEventHandlers,
    play
}