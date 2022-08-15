import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {MResultNode} from '../../model';
import {createNode} from './common';

function ResultNodeImpl(props: NodeProps<MResultNode>) {
    return (
        <>
            <Handle type="target" position={Position.Left} />
            <div>Result</div>
            {props.data.input === undefined ? <div className="node-error-msg">No input</div> : null}
        </>
    );
}

export const ResultNode = createNode(ResultNodeImpl);
