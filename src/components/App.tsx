import '../styles/App.css';
import {modelActions, useDispatch, useSelector} from '../redux/store';
import {Spinner} from './Spinner';
import {QueryResult} from './QueryResult';
import {Flow} from './Flow';
import {useCallback} from 'react';
import {MNodeType} from '../model';
import {uuid} from '../utils';

function App() {
    const isLoaded = useSelector(s => s.schema.isLoaded);
    const dispatch = useDispatch();

    const addNode = useCallback(
        (type: MNodeType) => {
            dispatch(
                modelActions.addNodes([
                    {
                        type,
                        id: uuid(),
                        position: {x: 0, y: 0},
                    },
                ])
            );
        },
        [dispatch]
    );

    const addTable = useCallback(() => addNode(MNodeType.table), [addNode]);
    const addFilter = useCallback(() => addNode(MNodeType.filter), [addNode]);

    const clear = useCallback(() => dispatch(modelActions.clear()), [dispatch]);
    const save = useCallback(() => dispatch(modelActions.save()), [dispatch]);
    const restore = useCallback(() => dispatch(modelActions.restore()), [dispatch]);

    if (!isLoaded) {
        return <Spinner />;
    }
    return (
        <div style={{height: '300px', width: '800px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', gap: '4px'}}>
                    <button onClick={addTable}>Table</button>
                    <button onClick={addFilter}>Filter</button>
                </div>
                <div style={{display: 'flex', gap: '4px'}}>
                    <button onClick={clear}>Clear</button>
                    <button onClick={save}>Save</button>
                    <button onClick={restore}>Restore</button>
                </div>
            </div>
            <Flow />
            <QueryResult />
        </div>
    );
}

export default App;
