import { socketService } from './socket.service';
import { spotifyService } from './spotify.service';

function createEventHandlers(player, dispatch, commit) {
    player.on('initialization_error', e => console.error(e));
    player.on('authentication_error', e => console.error(e));
    player.on('account_error', e => console.error(e));
    player.on('playback_error', e => console.error(e));

    // Playback status updates

    player.on('player_state_changed', newState => {
        dispatch({ type: 'updateState', newState });
        dispatch('deviceState');
        // console.log('player_state_changed');
    });

    // Ready
    player.on('ready', ({ device_id }) => {
        console.log('Let the music play on!');
        console.log('Connected with Device ID', device_id);
        commit({ type: 'deviceId', deviceId: device_id });
        _transferPlayback(device_id);
    });

    player.on('not_ready', ({ device_id }) => {
        console.log('Device ID is not ready for playback', device_id);
    });
}

async function _transferPlayback(deviceId) {
    try {
        await spotifyService.updatePlayer(deviceId);
    } catch (err) {
        console.log('cannot transfer playback', err);
    }
}

async function playHandler(dispatch, getters, uris) {
    try {
        const { deviceId, token } = getters;
        await spotifyService.playTrack(uris, deviceId, token);
        dispatch('updateState', { newState: null });
        socketService.emit('change');
    } catch (err) {
        console.log('can\'t play track', err);
    }
}

export const playerService = {
    createEventHandlers,
    playHandler
}