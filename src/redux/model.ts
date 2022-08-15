import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit';
import {getInputNode, MNode, MNodeType, Model} from '../model';
import {uuid} from '../utils';

type ModelState = {
    model: Model;
};

const initialState: ModelState = {
    model: [{type: MNodeType.table, id: uuid(), position: {x: 10, y: 10}}],
};

export type NodeUpdate = Partial<MNode> & Pick<MNode, 'id'>;

function updateNodes(state: Draft<ModelState>, updates: NodeUpdate[]) {
    for (const update of updates) {
        const idx = state.model.findIndex(n => n.id === update.id);
        const node = state.model[idx];
        state.model[idx] = {
            ...node,
            ...update,
        } as MNode;
    }
}

export const modelSlice = createSlice({
    name: 'model',
    initialState,
    reducers: {
        addNodes(state, action: PayloadAction<MNode[]>) {
            state.model = state.model.concat(action.payload);
        },
        updateNodes(state, action: PayloadAction<NodeUpdate[]>) {
            updateNodes(state, action.payload);
        },
        removeNodes(state, action: PayloadAction<string[]>) {
            let allUpdates: NodeUpdate[] = [];
            for (const id of action.payload) {
                const idx = state.model.findIndex(n => n.id === id);
                state.model.splice(idx, 1);

                const updates: NodeUpdate[] = state.model
                    .map(n => {
                        const input = getInputNode(n);
                        if (input === id) {
                            return {id: n.id, type: n.type, inputNode: undefined} as NodeUpdate;
                        }
                        return undefined;
                    })
                    .filter(u => u !== undefined)
                    .map(u => u!);
                allUpdates = allUpdates.concat(updates);
            }
            updateNodes(state, allUpdates);
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
