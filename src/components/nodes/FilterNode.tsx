import {Handle, Position} from 'react-flow-renderer';
import {createNode} from './common';

function FilterNodeImpl() {
    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div>Filter</div>
        </>
    );
}

export const FilterNode = createNode(FilterNodeImpl);
