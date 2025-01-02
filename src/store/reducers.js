import { combineReducers } from '@reduxjs/toolkit';
import DEFAULT_OUTLOOK_DATA_STATE from './reducers/outLook.reducers';
import DEFAULT_SETTINGS_DATA_STATE from './reducers/settings.reducers';
const reducers = combineReducers({
    outLookData:DEFAULT_OUTLOOK_DATA_STATE,
    settingsData:DEFAULT_SETTINGS_DATA_STATE
});

export default reducers;
