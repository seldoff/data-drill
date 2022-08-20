import {QueryExecResult} from 'sql.js';
import '../styles/Table.css';

export function Table(props: {data: QueryExecResult}) {
    return (
        <table style={{width: '100%'}}>
            <thead style={{textAlign: 'left'}}>
                <tr>
                    {props.data.columns.map(c => (
                        <th key={c}>{c}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.data.values.map((row, i) => {
                    return (
                        <tr key={i}>
                            {row.map((c, i) => (
                                <td key={i}>{c}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
