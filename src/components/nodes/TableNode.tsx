import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {ChangeEventHandler, useCallback, useMemo} from 'react';
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
                        type: mnode.type,
                        table,
                    },
                ])
            );
        },
        [dispatch, mnode.id, mnode.type]
    );

    const options = useMemo(() => {
        const options = tables.map(t => (
            <option value={t} key={t}>
                {t}
            </option>
        ));
        return [
            <option key={-1} value="" hidden>
                Please select table
            </option>,
            ...options,
        ];
    }, [tables]);

    return (
        <>
            <Handle type="source" id="" position={Position.Right} />

            <div>Table</div>
            <select value={mnode.table} onChange={changeTable}>
                {options}
            </select>
        </>
    );
}

export const TableNode = createNode(TableNodeImpl);