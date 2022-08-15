import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {MResultNode} from '../../model';
import {createNode} from './common';
import {ResultTable} from '../ResultTable';
import {useSelector} from '../../redux/store';

function ResultNodeImpl(props: NodeProps<MResultNode>) {
    const model = useSelector(s => s.model.model);
    if (model.find(n => n.id === props.data.id) === undefined) {
        // This may happen when we already removed this node from the model as a reaction to Flow event or
        // some other interaction. But Flow itself still tries to rerender nodes with props generated from
        // the model before node removal.
        console.warn('ResultNode was rendered with node that no longer exists in the model.');
        return null;
    }
    return (
        <div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div>Result</div>
            <ResultTable nodeId={props.data.id} model={model} errorClassName="node-error-msg" />
        </div>
    );
}

export const ResultNode = createNode(ResultNodeImpl, {
    width: 'fit-content',
    minWidth: '150px',
    maxWidth: '300px',
    height: 'fit-content',
});
