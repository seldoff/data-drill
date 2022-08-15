import {MNodeType, Model} from '../model';
import {Query} from './queryModel';
import {Result} from '../utils';

const notImplemented: Result<Query> = {
    successful: false,
    message: 'Not implemented',
};

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
            return notImplemented;
        case MNodeType.result:
            if (node.inputNode !== undefined) {
                return generateQuery(node.inputNode, model);
            } else {
                return {
                    successful: false,
                    message: 'Please provide input',
                };
            }
    }
}
