import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {ChangeEventHandler, useCallback, useEffect, useMemo} from 'react';
import {modelActions, useDispatch, useSelector} from '../../redux/store';
import {MTableNode} from '../../model';
import {createNode} from './common';

function TableNodeImpl(props: NodeProps<MTableNode>) {
    const mnode = props.data;
    const tables = useSelector(s => s.schema.schema.map(t => t.name));
    const dispatch = useDispatch();

    const changeTable = useCallback<ChangeEventHandler<HTMLSelectElement>>(
        e => {
            const table = e.target.value;
            dispatch(
                modelActions.updateNodes([
                    {
                        id: mnode.id,
                        table,
                    } as MTableNode,
                ])
            );
        },
        [dispatch, mnode.id]
    );

    const options = useMemo(() => {
        const options = tables.map(t => (
            <option value={t} key={t}>
                {t}
            </option>
        ));
        return [
            <option key={-1} value="" hidden>
                Select table
            </option>,
            ...options,
        ];
    }, [tables]);

    useEffect(() => {
        if (props.selected) {
            //dispatch();
        }
    }, [props.selected]);

    return (
        <>
            <Handle type="source" position={Position.Right} />
            <div>Table</div>
            <select value={mnode.table} onChange={changeTable}>
                {options}
            </select>
        </>
    );
}

export const TableNode = createNode(TableNodeImpl);
