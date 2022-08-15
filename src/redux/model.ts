import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MNode, MNodeType, Model} from '../model';
import {uuid} from '../utils';

type ModelState = {
    model: Model;
};

const initialState: ModelState = {
    model: [{type: MNodeType.table, id: uuid(), position: {x: 10, y: 10}}],
};

export type NodeUpdate = Partial<MNode>;

export const modelSlice = createSlice({
    name: 'model',
    initialState,
    reducers: {
        addNodes(state, action: PayloadAction<MNode[]>) {
            state.model = state.model.concat(action.payload);
        },
        updateNodes(state, action: PayloadAction<NodeUpdate[]>) {
            for (const update of action.payload) {
                const idx = state.model.findIndex(n => n.id === update.id);
                state.model[idx] = {
                    ...state.model[idx],
                    ...update,
                };
            }
        },
        removeNodes(state, action: PayloadAction<string[]>) {
            for (const id of action.payload) {
                const idx = state.model.findIndex(n => n.id === id);
                state.model.splice(idx, 1);
            }
        },
        clear(state) {
            state.model = [];
        },
        save(state) {
            localStorage.setItem('model', JSON.stringify(state));
        },
        restore(state) {
            const json = localStorage.getItem('model');
            return json !== null ? (JSON.parse(json) as ModelState) : state;
        },
    },
});
