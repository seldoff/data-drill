import {XYPosition} from 'react-flow-renderer/dist/esm/types/utils';
import {uuid} from './utils';

export enum MNodeType {
    table = 'table',
    filter = 'filter',
    result = 'result',
    columns = 'columns',
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
    filter: string;
    inputNode?: string;
};

export type MResultNode = MBaseNode & {
    type: MNodeType.result;
    inputNode?: string;
};

export type MColumnsNode = MBaseNode & {
    type: MNodeType.columns;
    inputNode?: string;
    selectedColumns: string[];
};

export type MNode = MTableNode | MFilterNode | MResultNode | MColumnsNode;

export type Model = MNode[];

export function getInputNode(node: MNode): string | undefined {
    switch (node.type) {
        case MNodeType.filter:
        case MNodeType.result:
        case MNodeType.columns:
            return node.inputNode;
        case MNodeType.table:
            return undefined;
    }
}

export function createEmptyNode(type: MNodeType): MNode {
    const position = {x: 20, y: 20};
    const id = uuid();
    switch (type) {
        case MNodeType.table:
            return {type, id, position};
        case MNodeType.filter:
            return {type, id, position, filter: ''};
        case MNodeType.result:
            return {type, id, position};
        case MNodeType.columns:
            return {type, id, position, selectedColumns: []};
    }
}
