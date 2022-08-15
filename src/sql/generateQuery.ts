import {MNode, MNodeType, Model} from '../model';
import {Query} from './queryModel';
import {Result} from '../utils';

const notImplemented: Result<Query> = {
    successful: false,
    message: 'Not implemented',
};

export function generateQuery(node: MNode, model: Model): Result<Query> {
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
                const inputNode = model.find(n => n.id === node.inputNode)!;
                return generateQuery(inputNode, model);
            } else {
                return {
                    successful: false,
                    message: 'Please provide input',
                };
            }
    }
}
