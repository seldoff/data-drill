import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {findParentNodeByType, MColumnsNode, MNodeType, MTableNode} from '../../model';
import {createNode} from './common';
import {useCallback, useMemo} from 'react';
import {modelActions, useDispatch, useSelector} from '../../redux/store';
import {ColumnsPicker} from '../ColumnsPicker';

function ColumnsNodeImpl(props: NodeProps<MColumnsNode>) {
    const {selectedColumns, id} = props.data;

    const model = useSelector(s => s.model.model);
    const schema = useSelector(s => s.schema.schema);
    const dispatch = useDispatch();

    const tableNode = useMemo<MTableNode | undefined>(
        () => findParentNodeByType<MTableNode>(props.data, model, MNodeType.table),
        [model, props.data]
    );

    const updateColumns = useCallback(
        (columns: string[]) =>
            dispatch(
                modelActions.updateNodes([{id, type: MNodeType.columns, selectedColumns: columns}])
            ),
        [dispatch, id]
    );

    const addColumn = useCallback(
        (column: string) => updateColumns(selectedColumns.concat(column)),
        [selectedColumns, updateColumns]
    );

    const changeColumn = useCallback(
        (prevColumn: string, newColumn: string) => {
            const updated = selectedColumns.filter(c => c !== prevColumn).concat(newColumn);
            updateColumns(updated);
        },
        [selectedColumns, updateColumns]
    );

    const removeColumn = useCallback(
        (column: string) => updateColumns(selectedColumns.filter(c => c !== column)),
        [selectedColumns, updateColumns]
    );

    const getColumnControls = useCallback(
        (column: string) => {
            return (
                <button title="Remove" onClick={() => removeColumn(column)}>
                    -
                </button>
            );
        },
        [removeColumn]
    );

    let content: JSX.Element | null;
    if (props.data.inputNode === undefined) {
        content = <div className="node-error-msg">Please provide input</div>;
    } else if (tableNode?.table === undefined) {
        content = <div className="node-error-msg">Please select table</div>;
    } else {
        const possibleColumns = schema
            .find(t => t.name === tableNode.table)!
            .columns.map(c => c.name);
        content = (
            <ColumnsPicker
                possibleColumns={possibleColumns}
                selectedColumns={props.data.selectedColumns}
                getColumnControls={getColumnControls}
                addColumn={addColumn}
                changeColumn={changeColumn}
            />
        );
    }

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div>Query Columns</div>
            {content}
        </>
    );
}

export const ColumnsNode = createNode(ColumnsNodeImpl);
