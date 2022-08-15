import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MNode, MNodeType} from '../model';
import {uuid} from '../utils';

type ModelState = {
    nodes: MNode[];
};

const initialState: ModelState = {
    nodes: [{type: MNodeType.table, id: uuid(), position: {x: 10, y: 10}}],
};

export type NodeUpdate = Omit<Partial<MNode>, 'type'>;

export const modelSlice = createSlice({
    name: 'model',
    initialState,
    reducers: {
        addNodes(state, action: PayloadAction<MNode[]>) {
            state.nodes = state.nodes.concat(action.payload);
        },
        updateNodes(state, action: PayloadAction<NodeUpdate[]>) {
            for (const update of action.payload) {
                const idx = state.nodes.findIndex(n => n.id === update.id);
                state.nodes[idx] = {
                    ...state.nodes[idx],
                    ...update,
                };
            }
        },
        removeNodes(state, action: PayloadAction<string[]>) {
            for (const id of action.payload) {
                const idx = state.nodes.findIndex(n => n.id === id);
                state.nodes.splice(idx, 1);
            }
        },
        clear(state) {
            state.nodes = [];
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
