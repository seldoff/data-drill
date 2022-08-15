import {useSelector} from '../redux/store';
import {SqlDisplay} from './SqlDisplay';
import {useContext, useEffect, useState} from 'react';
import {executeQueryForNode, QueryForNodeResult} from '../sql/sqlite';
import {DbContext} from './DbContext';
import {Table} from './Table';

export function SelectedNodeResultTable() {
    const selectedNode = useSelector(s => s.ui.selectedNode);
    const model = useSelector(s => s.model.model);
    const db = useContext(DbContext)!;
    const [result, setResult] = useState<QueryForNodeResult>();

    useEffect(() => {
        if (selectedNode !== undefined) {
            setResult(executeQueryForNode(db, selectedNode, model));
        } else {
            setResult(undefined);
        }
    }, [db, model, selectedNode]);

    if (result === undefined) {
        return <div style={{color: 'silver'}}>Please select node</div>;
    }

    if (!result.successful) {
        return <div className="error-msg">{result.message}</div>;
    }

    const {sql, data} = result.data;
    const left = data.successful ? (
        <div style={{overflowY: 'auto', maxHeight: '200px'}}>
            <Table data={data.data} />
        </div>
    ) : (
        <div className="error-msg">{data.message}</div>
    );

    let rowsNumber: string | null = null;
    if (data.successful) {
        const len = data.data.values.length;
        rowsNumber = `Returned ${len} ${len === 1 ? 'row' : 'rows'}`;
    }

    return (
        <table style={{tableLayout: 'fixed', width: '100%'}}>
            <tbody>
                <tr>
                    <td>{left}</td>
                    <td style={{verticalAlign: 'top'}}>
                        <span>Query </span>
                        <SqlDisplay sql={sql} />
                        <p />
                        {rowsNumber}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
