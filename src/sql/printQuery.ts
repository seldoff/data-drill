import {Query} from './queryModel';

export function printQuery(query: Query): string {
    switch (query.type) {
        case 'select':
            return `SELECT ${query.columns.join(', ')} FROM ${query.table}`;
    }
}
