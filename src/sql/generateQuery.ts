import {MNodeType, Model} from '../model';
import {Query} from './queryModel';
import {map, Result} from '../utils';

export function generateQuery(nodeId: string, model: Model): Result<Query> {
    const node = model.find(n => n.id === nodeId)!;
    switch (node.type) {
        case MNodeType.table:
            if (node.table !== undefined) {
                return {
                    successful: true,
                    data: {
                        type: 'select',
                        table: node.table,
                        columns: ['*'],
                    },
                };
            } else {
                return {
                    successful: false,
                    message: 'Please select table',
                };
            }
        case MNodeType.filter:
            if (node.inputNode !== undefined) {
                const target = generateQuery(node.inputNode, model);
                const trimmedFilter = node.filter.trim();
                if (trimmedFilter.length === 0) {
                    return target;
                }
                return map<Query, Query>(target, q => ({
                    type: 'where',
                    target: q,
                    expression: trimmedFilter,
                }));
            } else {
                return {
                    successful: false,
                    message: 'Please provide input',
                };
            }
        case MNodeType.result:
            if (node.inputNode !== undefined) {
                return generateQuery(node.inputNode, model);
            } else {
                return {
                    successful: false,
                    message: 'Please provide input',
                };
            }
        case MNodeType.columns:
            if (node.inputNode !== undefined) {
                const query = generateQuery(node.inputNode, model);
                if (node.selectedColumns.length === 0) {
                    return query;
                }

                return map<Query, Query>(query, query => {
                    let q = query;
                    let exit = false;
                    while (!exit) {
                        switch (q.type) {
                            case 'select':
                                q.columns = node.selectedColumns;
                                exit = true;
                                break;
                            case 'where':
                                q = q.target;
                                break;
                        }
                    }
                    return query;
                });
            } else {
                return {
                    successful: false,
                    message: 'Please provide input',
                };
            }
    }
}
