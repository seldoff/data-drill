import {Query} from './queryModel';

export function printQuery({select, where, orderBy}: Query): string {
    let printed = 'SELECT ';
    if (select.columns.length === 0) {
        printed += '*';
    } else {
        printed += select.columns.join(', ');
    }
    printed += ` FROM ${select.table}`;

    if (where.filters.length === 1) {
        printed += ` WHERE ${where.filters[0]}`;
    } else if (where.filters.length > 1) {
        printed += ` WHERE ${where.filters.map(f => `(${f})`).join(' AND ')}`;
    }

    if (orderBy.columns.length > 0) {
        const columns = orderBy.columns.map(
            (c, i) => `${c} ${orderBy.directions[i].toUpperCase()}`
        );
        printed += ` ORDER BY ${columns.join(', ')}`;
    }

    return printed;
}
