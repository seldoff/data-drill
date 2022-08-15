import {Handle, NodeProps, Position} from 'react-flow-renderer';
import {getInputNode, MColumnsNode, MNode, MNodeType, MTableNode} from '../../model';
import {createNode} from './common';
import {useCallback, useMemo} from 'react';
import {modelActions, useDispatch, useSelector} from '../../redux/store';
import {ColumnsPicker} from '../ColumnsPicker';

function ColumnsNodeImpl(props: NodeProps<MColumnsNode>) {
    const model = useSelector(s => s.model.model);
    const schema = useSelector(s => s.schema.schema);
    const dispatch = useDispatch();

    const tableNode = useMemo<MTableNode | undefined>(() => {
        let node: MNode | undefined = props.data;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (node === undefined) {
                return undefined;
            }
            if (node.type === MNodeType.table) {
                return node;
            }
            const inputNode = getInputNode(node);
            if (inputNode === undefined) {
                return undefined;
            }
            node = model.find(n => n.id === inputNode);
        }
    }, [model, props.data]);

    const addColumn = useCallback<(column: string) => void>(
        column => {
            dispatch(
                modelActions.updateNodes([
                    {id: props.data.id, selectedColumns: props.data.selectedColumns.concat(column)},
                ])
            );
        },
        [dispatch, props.data.id, props.data.selectedColumns]
    );

    const changeColumn = useCallback(
        (prevColumn: string, newColumn: string) => {
            const selectedColumns = props.data.selectedColumns
                .filter(c => c !== prevColumn)
                .concat(newColumn);
            dispatch(modelActions.updateNodes([{id: props.data.id, selectedColumns}]));
        },
        [dispatch, props.data.id, props.data.selectedColumns]
    );

    const removeColumn = useCallback(
        (column: string) => {
            dispatch(
                modelActions.updateNodes([
                    {
                        id: props.data.id,
                        selectedColumns: props.data.selectedColumns.filter(c => c !== column),
                    },
                ])
            );
        },
        [dispatch, props.data.id, props.data.selectedColumns]
    );

    let content;
    if (props.data.inputNode === undefined) {
        content = <div className="node-error-msg">Please provide input</div>;
    } else if (tableNode?.table === undefined) {
        content = <div className="node-error-msg">Please select table</div>;
    } else {
        const possibleColumns = schema.find(t => t.name === tableNode.table)!.columns;
        content = (
            <ColumnsPicker
                possibleColumns={possibleColumns}
                selectedColumns={props.data.selectedColumns}
                addColumn={addColumn}
                changeColumn={changeColumn}
                removeColumn={removeColumn}
            />
        );
    }

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <div>Pick Columns</div>
            {content}
        </>
    );
}

export const ColumnsNode = createNode(ColumnsNodeImpl);
