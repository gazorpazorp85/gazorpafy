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
        console.log('player_state_changed');
    });

    // Ready
    player.on('ready', data => {
        const { device_id } = data;
        console.log('Let the music play on!');
        console.log('Connected with Device ID', device_id);
        commit({ type: 'deviceId', deviceId: device_id });
        _transferPlayback(device_id);
    });
}

async function _transferPlayback(device_id) {
    try {
        await spotifyService.updatePlayer(device_id);
    } catch (err) {
        console.log('cannot transfer playback', err);
    }
}

export const playerService = {
    createEventHandlers,
}