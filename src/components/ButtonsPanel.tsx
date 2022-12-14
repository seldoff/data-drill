import {useCallback} from 'react';
import {createEmptyNode, MNodeType} from '../model';
import {modelActions, useDispatch} from '../redux/store';

export function ButtonsPanel() {
    const dispatch = useDispatch();

    const addNode = useCallback(
        (type: MNodeType) => {
            dispatch(modelActions.addNodes([createEmptyNode(type)]));
        },
        [dispatch]
    );

    const addTable = useCallback(() => addNode(MNodeType.table), [addNode]);
    const addColumns = useCallback(() => addNode(MNodeType.columns), [addNode]);
    const addFilter = useCallback(() => addNode(MNodeType.filter), [addNode]);
    const addSort = useCallback(() => addNode(MNodeType.sort), [addNode]);
    const addResult = useCallback(() => addNode(MNodeType.result), [addNode]);

    const clear = useCallback(() => dispatch(modelActions.clear()), [dispatch]);
    const save = useCallback(() => dispatch(modelActions.save()), [dispatch]);
    const restore = useCallback(() => dispatch(modelActions.restore()), [dispatch]);

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', gap: '4px'}}>
                <button onClick={addTable}>Table</button>
                <button onClick={addColumns}>Columns</button>
                <button onClick={addFilter}>Filter</button>
                <button onClick={addSort}>Sort</button>
                <button onClick={addResult}>Result</button>
            </div>
            <div style={{display: 'flex', gap: '4px'}}>
                <button onClick={clear}>Clear</button>
                <button onClick={save}>Save</button>
                <button onClick={restore}>Restore</button>
            </div>
        </div>
    );
}
