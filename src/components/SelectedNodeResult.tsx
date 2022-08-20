import '../styles/SelectedNodeResult.css';
import {useSelector} from '../redux/store';
import {SqlDisplay} from './SqlDisplay';
import {useContext, useEffect, useState} from 'react';
import {executeQueryForNode, QueryForNodeResult} from '../sql/sqlite';
import {DbContext} from './DbContext';
import {Table} from './Table';

export function SelectedNodeResult() {
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
        <div className="selected-node-result-table">
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
        <div style={{display: 'flex', height: '100%'}}>
            <div style={{width: '60%', overflowY: 'auto'}}>{left}</div>
            <div style={{borderLeft: '1px solid silver'}} />
            <div className="selected-node-result-query" style={{width: '40%', overflowY: 'auto'}}>
                <span>Query </span>
                <SqlDisplay sql={sql} />
                <p />
                {rowsNumber}
            </div>
        </div>
    );
}
