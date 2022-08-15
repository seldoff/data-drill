import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {MResultNode} from '../../model';
import {createNode} from './common';

function ResultNodeImpl(props: NodeProps<MResultNode>) {
    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div>Result</div>
            {props.data.inputNode === undefined ? (
                <div className="node-error-msg">No input</div>
            ) : null}
        </>
    );
}

export const ResultNode = createNode(ResultNodeImpl);
