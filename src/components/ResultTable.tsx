import {useContext, useEffect, useMemo, useState} from 'react';
import {QueryExecResult} from 'sql.js';
import {ExecuteQueryContext} from './ExecuteQueryContext';
import {Spinner} from './Spinner';
import {Table} from './Table';
import {Result} from '../utils';
import {useSelector} from '../redux/store';

export function ResultTable(props: {nodeId: string}) {
    const [result, setResult] = useState<Result<QueryExecResult>>();
    const executeQuery = useContext(ExecuteQueryContext)!;
    const model = useSelector(s => s.model.model);

    const node = useMemo(() => model.find(n => n.id === props.nodeId)!, [model, props.nodeId]);

    useEffect(() => {
        setResult(executeQuery(node, model));
    }, [executeQuery, model, node]);

    if (result === undefined) {
        return <Spinner />;
    } else if (!result.successful) {
        return <div className="error-msg">{result.message}</div>;
    } else {
        return (
            <div style={{overflowY: 'scroll', maxHeight: '200px'}}>
                <Table data={result.data} />
            </div>
        );
    }
}
