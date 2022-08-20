import {Schema} from '../schema';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type SchemaState = {
    schema: Schema;
};

const initialState: SchemaState = {
    schema: [],
};

export const schemaSlice = createSlice({
    name: 'schema',
    initialState,
    reducers: {
        schemaLoaded(state, action: PayloadAction<Schema>) {
            state.schema = action.payload;
        },
    },
});
