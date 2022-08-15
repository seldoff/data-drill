import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {MResultNode} from '../../model';
import {createNode} from './common';
import {useSelector} from '../../redux/store';
import {useContext, useEffect, useState} from 'react';
import {DbContext} from '../DbContext';
import {executeQueryForNode, QueryForNodeResult} from '../../sql/sqlite';
import {Table} from '../Table';

function ResultNodeImpl(props: NodeProps<MResultNode>) {
    const model = useSelector(s => s.model.model);
    const db = useContext(DbContext)!;
    const [result, setResult] = useState<QueryForNodeResult>();

    useEffect(() => {
        if (model.find(n => n.id === props.data.id) === undefined) {
            // This may happen when we already removed this node from the model as a reaction to Flow event or
            // some other interaction. But Flow itself still tries to rerender nodes with props generated from
            // the model before node removal.
            console.warn('ResultNode was rendered with node that no longer exists in the model.');
            return;
        }

        setResult(executeQueryForNode(db, props.data.id, model));
    }, [db, model, props.data.id]);

    let content: JSX.Element | null;
    let header = 'Result';

    if (result === undefined) {
        content = null;
    } else if (!result.successful) {
        content = <div className="node-error-msg">{result.message}</div>;
    } else {
        const queryResult = result.data.data;
        if (!queryResult.successful) {
            content = <div className="node-error-msg">{queryResult.message}</div>;
        } else {
            const len = queryResult.data.values.length;
            header = `Result: ${len} ${len === 1 ? 'row' : 'rows'}`;

            content = (
                <div style={{overflowY: 'auto', maxHeight: '250px'}}>
                    <Table data={queryResult.data} />
                </div>
            );
        }
    }

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />

            <div>{header}</div>
            {content}
        </>
    );
}

export const ResultNode = createNode(ResultNodeImpl, {
    width: 'fit-content',
    minWidth: '150px',
    maxWidth: '300px',
    height: 'fit-content',
});
