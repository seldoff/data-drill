import {Query} from './queryModel';

export function printQuery({select, where, orderBy, aggregation}: Query): string {
    let printed = `FROM ${select.table}`;

    if (where !== undefined) {
        if (where.filters.length === 1) {
            printed += ` WHERE ${where.filters[0]}`;
        } else if (where.filters.length > 1) {
            printed += ` WHERE ${where.filters.map(f => `(${f})`).join(' AND ')}`;
        }
    }

    if (orderBy !== undefined) {
        if (orderBy.columns.length > 0) {
            const columns = orderBy.columns.map(
                (c, i) => `${c} ${orderBy.directions[i].toUpperCase()}`
            );
            printed += ` ORDER BY ${columns.join(', ')}`;
        }
    }

    if (aggregation !== undefined) {
        const {func, distinct, column} = aggregation;
        printed =
            `SELECT ${func.toUpperCase()}(${distinct ? 'DISTINCT ' : ''}${column}) ` + printed;
    } else {
        printed =
            `SELECT ${select.columns.length === 0 ? '*' : select.columns.join(', ')} ` + printed;
    }

    return printed;
}
