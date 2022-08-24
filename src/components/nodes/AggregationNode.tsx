import {createNode} from './common';
import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {MAggregationNode, validateAggregation} from '../../model';
import {useSelector} from '../../redux/store';

function AggregationNodeImpl(props: NodeProps<MAggregationNode>) {
    const model = useSelector(s => s.model.model);

    let content: JSX.Element | null;
    const validation = validateAggregation(props.data, model);
    if (validation.successful) {
        content = <span>A</span>;
    } else {
        content = <div className="node-error-msg">{validation.message}</div>;
    }

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <div>Aggregation</div>
            {content}
        </>
    );
}

export const AggregationNode = createNode(AggregationNodeImpl);
