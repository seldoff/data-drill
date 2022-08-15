import {configureStore} from '@reduxjs/toolkit';
import {
    TypedUseSelectorHook,
    useSelector as useSelectorVanilla,
    useDispatch as useDispatchVanilla,
} from 'react-redux';
import logger from 'redux-logger';
import {schemaSlice} from './schema';
import {modelSlice} from './model';

const isProduction = process.env.NODE_ENV !== 'production';
const loggerMiddleware = isProduction ? [logger] : [];

export const store = configureStore({
    reducer: {
        schema: schemaSlice.reducer,
        model: modelSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(loggerMiddleware),
    devTools: !isProduction,
});

export type RootState = ReturnType<typeof store.getState>;

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorVanilla;
export const useDispatch: () => typeof store.dispatch = useDispatchVanilla;

export const schemaActions = schemaSlice.actions;
export const modelActions = modelSlice.actions;
