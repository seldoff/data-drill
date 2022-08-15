import {createSlice, PayloadAction} from '@reduxjs/toolkit';

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
});
