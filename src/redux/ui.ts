import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {modelSlice} from './model';

type UiState = {
    selectedNode: string | undefined;
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {} as UiState,
    reducers: {
        setSelectedNode(state, action: PayloadAction<string | undefined>) {
            state.selectedNode = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(modelSlice.actions.removeNodes, state => {
                state.selectedNode = undefined;
            })
            .addCase(modelSlice.actions.clear, state => {
                state.selectedNode = undefined;
            })
            .addCase(modelSlice.actions.restore, state => {
                state.selectedNode = undefined;
            })
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .addDefaultCase(() => {});
    },
});
