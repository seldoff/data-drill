import {ColumnSchema} from '../schema';
import {ChangeEventHandler, useCallback} from 'react';

function getPossibleOptions(possibleColumns: string[]) {
    return possibleColumns.map(c => {
        return (
            <option key={c} value={c}>
                {c}
            </option>
        );
    });
}

function Selector(props: {
    possibleColumns: string[];
    selectedColumn: string;
    changeColumn: (prevColumn: string, newColumn: string) => void;
    removeColumn: (column: string) => void;
}) {
    const {selectedColumn, changeColumn, removeColumn} = props;

    const changeColumnCallback = useCallback<ChangeEventHandler<HTMLSelectElement>>(
        e => {
            const column = e.target.value;
            changeColumn(selectedColumn, column);
        },
        [changeColumn, selectedColumn]
    );

    const removeColumnCallback = useCallback(
        () => removeColumn(selectedColumn),
        [removeColumn, selectedColumn]
    );

    const selectedOption = (
        <option key={selectedColumn} value={selectedColumn} hidden>
            {selectedColumn}
        </option>
    );

    return (
        <div style={{display: 'flex', gap: '2px'}}>
            <select
                value={props.selectedColumn}
                onChange={changeColumnCallback}
                style={{flex: '1'}}
            >
                {[selectedOption, ...getPossibleOptions(props.possibleColumns)]}
            </select>
            <button title="Remove" onClick={removeColumnCallback}>
                -
            </button>
        </div>
    );
}

export function ColumnsPicker(props: {
    possibleColumns: ColumnSchema[];
    selectedColumns: string[];
    addColumn: (column: string) => void;
    changeColumn: (prevColumn: string, newColumn: string) => void;
    removeColumn: (column: string) => void;
}) {
    const {addColumn} = props;

    const addColumnCallback = useCallback<ChangeEventHandler<HTMLSelectElement>>(
        e => addColumn(e.target.value),
        [addColumn]
    );

    const possibleColumns = props.possibleColumns
        .filter(c => !props.selectedColumns.includes(c.name))
        .map(c => c.name);

    let emptySelector: JSX.Element | null = null;
    if (possibleColumns.length > 0) {
        const emptyOption = (
            <option key="-1" value="" hidden>
                Please select column
            </option>
        );

        emptySelector = (
            <select onChange={addColumnCallback} value="">
                {[emptyOption, ...getPossibleOptions(possibleColumns)]}
            </select>
        );
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
            {props.selectedColumns.map(c => {
                return (
                    <Selector
                        key={c}
                        selectedColumn={c}
                        possibleColumns={possibleColumns}
                        changeColumn={props.changeColumn}
                        removeColumn={props.removeColumn}
                    />
                );
            })}
            {emptySelector}
        </div>
    );
}
