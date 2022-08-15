import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {MResultNode} from '../../model';
import {createNode} from './common';
import {ResultTable} from '../ResultTable';

function ResultNodeImpl(props: NodeProps<MResultNode>) {
    return (
        <div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div>Result</div>
            <ResultTable nodeId={props.data.id} />
        </div>
    );
}

export const ResultNode = createNode(ResultNodeImpl, {
    width: 'fit-content',
    minWidth: '150px',
    maxWidth: '300px',
    height: 'fit-content',
});
