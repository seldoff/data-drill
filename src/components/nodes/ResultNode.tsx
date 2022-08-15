import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {MResultNode} from '../../model';
import {createNode} from './common';
import {Spinner} from '../Spinner';
import {useContext, useEffect, useState} from 'react';
import {Result} from '../../utils';
import {QueryExecResult} from 'sql.js';
import {ExecuteQueryContext} from '../ExecuteQueryContext';
import {ModelContext} from '../ModelContext';
import {Table} from '../Table';

function ResultNodeImpl(props: NodeProps<MResultNode>) {
    const [result, setResult] = useState<Result<QueryExecResult>>();
    const executeQuery = useContext(ExecuteQueryContext)!;
    const model = useContext(ModelContext)!;

    useEffect(() => {
        setResult(executeQuery(props.data, model));
    }, [executeQuery, model, props.data]);

    let content;
    if (result === undefined) {
        content = <Spinner />;
    } else if (!result.successful) {
        content = <div className="node-error-msg">{result.message}</div>;
    } else {
        content = (
            <div style={{overflowY: 'scroll', maxHeight: '200px'}}>
                <Table data={result.data} />
            </div>
        );
    }

    return (
        <div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div>Result</div>
            {content}
        </div>
    );
}

export const ResultNode = createNode(ResultNodeImpl, {
    width: 'fit-content',
    minWidth: '150px',
    maxWidth: '300px',
    height: 'fit-content',
});
