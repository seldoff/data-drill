import {XYPosition} from 'react-flow-renderer/dist/esm/types/utils';

export enum MNodeType {
    table = 'table',
    filter = 'filter',
    result = 'result',
}

type MBaseNode = {
    id: string;
    position: XYPosition;
    type: MNodeType;
};

export type MTableNode = MBaseNode & {
    type: MNodeType.table;
    table?: string;
};

export type MFilterNode = MBaseNode & {
    type: MNodeType.filter;
    input?: MNodeWithOutput;
};

export type MResultNode = MBaseNode & {
    type: MNodeType.result;
    input?: MNodeWithOutput;
};

export type MNodeWithOutput = MTableNode | MFilterNode;

export type MNode = MTableNode | MFilterNode | MResultNode;
