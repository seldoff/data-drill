import {useContext, useEffect, useState} from 'react';
import {QueryExecResult} from 'sql.js';
import {Spinner} from './Spinner';
import {Table} from './Table';
import {bind, map, Result} from '../utils';
import {DbContext} from './DbContext';
import {generateQuery} from '../sql/generateQuery';
import {printQuery} from '../sql/printQuery';
import {executeQuery} from '../sql/sqlite';
import {Model} from '../model';

export function ResultTable(props: {nodeId: string; model: Model; errorClassName: string}) {
    const [data, setData] = useState<Result<QueryExecResult> | undefined>();
    const model = props.model;

    const db = useContext(DbContext)!;

    useEffect(() => {
        const query = generateQuery(props.nodeId, model);
        const printed = map(query, printQuery);
        const data = bind(printed, q => executeQuery(db, q));
        setData(data);
    }, [db, model, props.nodeId]);

    if (data === undefined) {
        return <Spinner />;
    }

    if (!data.successful) {
        return <div className={props.errorClassName}>{data.message}</div>;
    } else {
        return (
            <div style={{overflowY: 'auto', maxHeight: '200px'}}>
                <Table data={data.data} />
            </div>
        );
    }
}
