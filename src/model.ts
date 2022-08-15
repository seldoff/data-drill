import {XYPosition} from 'react-flow-renderer/dist/esm/types/utils';

export enum MNodeType {
    table = 'table',
    filter = 'filter',
    result = 'result',
}

type MBaseNode = {
    id: string;
    position: XYPosition;
};

export type MTableNode = MBaseNode & {
    type: MNodeType.table;
    table?: string;
};

export type MFilterNode = MBaseNode & {
    type: MNodeType.filter;
    inputNode?: string;
};

export type MResultNode = MBaseNode & {
    type: MNodeType.result;
    inputNode?: string;
};

export type MNode = MTableNode | MFilterNode | MResultNode;

export type Model = MNode[];

export function getInputNode(node: MNode): string | undefined {
    switch (node.type) {
        case MNodeType.filter:
            return node.inputNode;
        case MNodeType.result:
            return node.inputNode;
        case MNodeType.table:
            return undefined;
    }
}
