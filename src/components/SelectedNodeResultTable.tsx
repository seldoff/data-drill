import {useSelector} from '../redux/store';
import {ResultTable} from './ResultTable';
import {SqlDisplay} from './SqlDisplay';
import {generateQuery} from '../sql/generateQuery';
import {useMemo} from 'react';
import {printQuery} from '../sql/printQuery';
import {map} from '../utils';

export function SelectedNodeResultTable() {
    const selectedNode = useSelector(s => s.ui.selectedNode);
    const model = useSelector(s => s.model.model);

    const sql = useMemo(() => {
        if (selectedNode === undefined) {
            return undefined;
        }
        return map(generateQuery(selectedNode, model), printQuery);
    }, [model, selectedNode]);

    const left =
        selectedNode !== undefined ? (
            <ResultTable nodeId={selectedNode} model={model} />
        ) : (
            <div className="error-msg">Please select node</div>
        );

    return (
        <table style={{tableLayout: 'fixed', width: '100%'}}>
            <tbody>
                <tr>
                    <td>{left}</td>
                    <td style={{verticalAlign: 'top'}}>
                        {sql !== undefined ? <SqlDisplay sql={sql} showError={false} /> : null}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
