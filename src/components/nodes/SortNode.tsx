import {createNode} from './common';
import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {findParentNodeByType, MNodeType, MSortNode, MTableNode, SortDirection} from '../../model';
import {modelActions, useDispatch, useSelector} from '../../redux/store';
import {useCallback, useMemo} from 'react';
import {ColumnsPicker} from '../ColumnsPicker';
import {NodeUpdate} from '../../redux/model';

function SortNodeImpl(props: NodeProps<MSortNode>) {
    const {selectedColumns, sortDirections, id} = props.data;

    const model = useSelector(s => s.model.model);
    const schema = useSelector(s => s.schema.schema);
    const dispatch = useDispatch();

    const tableNode = useMemo<MTableNode | undefined>(
        () => findParentNodeByType<MTableNode>(props.data, model, MNodeType.table),
        [model, props.data]
    );

    const updateColumns = useCallback(
        (columns?: string[], directions?: SortDirection[]) => {
            const update: NodeUpdate = {id, type: MNodeType.sort};
            if (columns !== undefined) {
                update.selectedColumns = columns;
            }
            if (directions !== undefined) {
                update.sortDirections = directions;
            }
            dispatch(modelActions.updateNodes([update]));
        },
        [dispatch, id]
    );

    const addColumn = useCallback(
        (column: string) =>
            updateColumns(selectedColumns.concat(column), sortDirections.concat(SortDirection.Asc)),
        [selectedColumns, sortDirections, updateColumns]
    );

    const changeColumn = useCallback(
        (prevColumn: string, newColumn: string) => {
            const updated = selectedColumns.filter(c => c !== prevColumn).concat(newColumn);
            updateColumns(updated);
        },
        [selectedColumns, updateColumns]
    );

    const removeColumn = useCallback(
        (column: string) => {
            const idx = selectedColumns.findIndex(c => c === column);
            updateColumns(
                selectedColumns.filter((_, i) => i !== idx),
                sortDirections.filter((_, i) => i !== idx)
            );
        },
        [selectedColumns, sortDirections, updateColumns]
    );

    const changeDirectionCallback = useCallback<(column: string, direction: SortDirection) => void>(
        (column, direction) => {
            const idx = selectedColumns.findIndex(c => c === column);
            const updated = [...sortDirections];
            updated[idx] = direction;
            updateColumns(undefined, updated);
        },
        [selectedColumns, sortDirections, updateColumns]
    );

    const getColumnControls = useCallback(
        (column: string) => {
            const idx = selectedColumns.findIndex(c => c === column);
            return (
                <>
                    <select
                        value={sortDirections[idx]}
                        onChange={e =>
                            changeDirectionCallback(column, e.target.value as SortDirection)
                        }
                        title="Select Sort Direction"
                    >
                        <option value={SortDirection.Asc}>Asc</option>
                        <option value={SortDirection.Desc}>Desc</option>
                    </select>
                    <button title="Remove" onClick={() => removeColumn(column)}>
                        -
                    </button>
                </>
            );
        },
        [changeDirectionCallback, removeColumn, selectedColumns, sortDirections]
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
                selectedColumns={selectedColumns}
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
            <div>Sort by Columns</div>
            {content}
        </>
    );
}

export const SortNode = createNode(SortNodeImpl, {minWidth: '210px'});
