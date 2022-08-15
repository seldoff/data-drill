import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {createNode} from './common';
import {ChangeEventHandler, KeyboardEventHandler, useCallback, useState} from 'react';
import {MFilterNode, MNodeType} from '../../model';
import {modelActions, useDispatch} from '../../redux/store';

function FilterNodeImpl(props: NodeProps<MFilterNode>) {
    const [filter, setFilter] = useState(props.data.filter);
    const dispatch = useDispatch();

    const changeFilter = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
        setFilter(e.target.value);
    }, []);

    const saveChanges = useCallback(() => {
        dispatch(modelActions.updateNodes([{id: props.data.id, type: MNodeType.filter, filter}]));
    }, [dispatch, filter, props.data.id]);

    const handleKeyDown = useCallback<KeyboardEventHandler>(
        e => {
            if (e.key === 'Enter') {
                saveChanges();
            }
        },
        [saveChanges]
    );

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div>Filter</div>
            <input
                type="text"
                value={filter}
                onChange={changeFilter}
                onBlur={saveChanges}
                onKeyDown={handleKeyDown}
            />
        </>
    );
}

export const FilterNode = createNode(FilterNodeImpl, {minWidth: '200px'});
