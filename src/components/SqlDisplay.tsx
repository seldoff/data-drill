import {Result} from '../utils';

export function SqlDisplay(props: {sql: Result<string>; showError: boolean}) {
    const sql = props.sql;
    return sql.successful ? (
        <div>{sql.data}</div>
    ) : props.showError ? (
        <div className="error-msg">{sql.message}</div>
    ) : null;
}
