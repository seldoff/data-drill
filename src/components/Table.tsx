import {QueryExecResult} from 'sql.js';

export function Table(props: {data: QueryExecResult}) {
    return (
        <table>
            <thead>
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
