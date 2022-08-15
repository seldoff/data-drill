import '../styles/App.css';
import {modelActions, useDispatch, useSelector} from '../redux/store';
import {Spinner} from './Spinner';
import {SelectedNodeResultTable} from './SelectedNodeResultTable';
import {Flow} from './Flow';
import {useCallback} from 'react';
import {createEmptyNode, MNodeType} from '../model';

function App() {
    const isLoaded = useSelector(s => s.schema.isLoaded);
    const dispatch = useDispatch();

    const addNode = useCallback(
        (type: MNodeType) => {
            dispatch(modelActions.addNodes([createEmptyNode(type)]));
        },
        [dispatch]
    );

    const addTable = useCallback(() => addNode(MNodeType.table), [addNode]);
    const addFilter = useCallback(() => addNode(MNodeType.filter), [addNode]);
    const addResult = useCallback(() => addNode(MNodeType.result), [addNode]);

    const clear = useCallback(() => dispatch(modelActions.clear()), [dispatch]);
    const save = useCallback(() => dispatch(modelActions.save()), [dispatch]);
    const restore = useCallback(() => dispatch(modelActions.restore()), [dispatch]);

    if (!isLoaded) {
        return <Spinner />;
    }
    return (
        <div style={{height: '500px', width: '800px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', gap: '4px'}}>
                    <button onClick={addTable}>Table</button>
                    <button onClick={addFilter}>Filter</button>
                    <button onClick={addResult}>Result</button>
                </div>
                <div style={{display: 'flex', gap: '4px'}}>
                    <button onClick={clear}>Clear</button>
                    <button onClick={save}>Save</button>
                    <button onClick={restore}>Restore</button>
                </div>
            </div>

            <Flow />
            <div style={{width: '100%', borderTop: '1px solid silver'}} />
            <SelectedNodeResultTable />
        </div>
    );
}

export default App;
