import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducers';


const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

export default store;
