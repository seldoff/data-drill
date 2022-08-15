import {Schema} from '../schema';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type SchemaState = {
    schema: Schema;
    isLoaded: boolean;
};

const initialState: SchemaState = {
    schema: [],
    isLoaded: false,
};

export const schemaSlice = createSlice({
    name: 'schema',
    initialState,
    reducers: {
        schemaLoaded(state, action: PayloadAction<Schema>) {
            state.schema = action.payload;
            state.isLoaded = true;
        },
    },
});
