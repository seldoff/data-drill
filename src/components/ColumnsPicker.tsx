import {ChangeEventHandler, useCallback} from 'react';

// To be able to safely use hardcoded keys
const getColumnKey = (column: string) => 'c_' + column;

function getOptions(
    possibleColumns: string[],
    selectedColumn: string | undefined,
    emptyValue = ''
) {
    const options =
        possibleColumns.length === 0
            ? [
                  <option key="npc" disabled>
                      All possible columns are already selected
                  </option>,
              ]
            : possibleColumns.map(c => {
                  return (
                      <option key={getColumnKey(c)} value={c}>
                          {c}
                      </option>
                  );
              });

    if (selectedColumn === undefined) {
        options.push(
            <option key="psc" value={emptyValue} hidden>
                Please select column
            </option>
        );
    } else {
        options.push(
            <option key={getColumnKey(selectedColumn)} value={selectedColumn} hidden>
                {selectedColumn}
            </option>
        );
    }

    return options;
}

function Selector(props: {
    possibleColumns: string[];
    selectedColumn: string | undefined;
    addColumn: (newColumn: string) => void;
    changeColumn: (prevColumn: string, newColumn: string) => void;
}) {
    const {possibleColumns, selectedColumn, addColumn, changeColumn} = props;

    const changeColumnCallback = useCallback<ChangeEventHandler<HTMLSelectElement>>(
        e => {
            const column = e.target.value;
            if (selectedColumn === undefined) {
                addColumn(column);
            } else {
                changeColumn(selectedColumn, column);
            }
        },
        [addColumn, changeColumn, selectedColumn]
    );

    return (
        <select
            value={selectedColumn ?? ''}
            onChange={changeColumnCallback}
            style={{width: '100%', height: '100%'}}
            title="Select Column"
        >
            {getOptions(possibleColumns, selectedColumn)}
        </select>
    );
}

export function ColumnsPicker(props: {
    possibleColumns: string[];
    selectedColumns: string[];
    getColumnControls: (column: string) => JSX.Element;
    addColumn: (column: string) => void;
    changeColumn: (prevColumn: string, newColumn: string) => void;
}) {
    const {selectedColumns, addColumn, changeColumn} = props;
    const possibleColumns = props.possibleColumns.filter(c => !selectedColumns.includes(c));

    const emptySelector =
        possibleColumns.length > 0 ? (
            <Selector
                key="empty"
                possibleColumns={possibleColumns}
                selectedColumn={undefined}
                addColumn={addColumn}
                changeColumn={changeColumn}
            />
        ) : null;

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
            {selectedColumns.map(c => {
                return (
                    <div key={getColumnKey(c)} style={{display: 'flex', gap: '2px'}}>
                        <div style={{flex: '1'}}>
                            <Selector
                                selectedColumn={c}
                                possibleColumns={possibleColumns}
                                addColumn={addColumn}
                                changeColumn={changeColumn}
                            />
                        </div>
                        {props.getColumnControls(c)}
                    </div>
                );
            })}
            {emptySelector}
        </div>
    );
}
