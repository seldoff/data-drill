import {XYPosition} from 'react-flow-renderer';
import {uuid, WhileLoopInfiniteCycleGuard} from './utils';
import exp from 'constants';
import {Result} from './result';

export enum MNodeType {
    table = 'table',
    filter = 'filter',
    result = 'result',
    columns = 'columns',
    sort = 'sort',
    aggregation = 'aggregation',
}

type MBaseNode = {
    id: string;
    type: MNodeType;
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

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

export type MSortNode = MBaseNode & {
    type: MNodeType.sort;
    inputNode?: string;
    selectedColumns: string[];
    sortDirections: SortDirection[];
};

export enum AggregationFunc {
    Avg = 'avg',
    Count = 'count',
    Max = 'max',
    Min = 'min',
    Sum = 'sum',
}

export type MAggregationNode = MBaseNode & {
    type: MNodeType.aggregation;
    inputNode?: string;
    func?: AggregationFunc;
    column?: string;
    distinct: boolean;
};

export type MNode =
    | MTableNode
    | MFilterNode
    | MResultNode
    | MColumnsNode
    | MSortNode
    | MAggregationNode;

export type Model = MNode[];

export function getInputNode(node: MNode): string | undefined {
    switch (node.type) {
        case MNodeType.filter:
        case MNodeType.result:
        case MNodeType.columns:
        case MNodeType.sort:
        case MNodeType.aggregation:
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
        case MNodeType.sort:
            return {type, id, position, selectedColumns: [], sortDirections: []};
        case MNodeType.aggregation:
            return {type, id, position, distinct: false};
    }
}

export function getParentNode(node: MNode | string, model: Model): MNode {
    const n = typeof node === 'string' ? model.find(n => n.id === node)! : node;
    const inputNode = getInputNode(n);
    return model.find(n => n.id === inputNode)!;
}

export function findParentNode<T extends MNode>(
    node: MNode,
    model: Model,
    predicate: (node: MNode) => boolean
): T | undefined {
    let currentNode: MNode | undefined = node;
    const guard = new WhileLoopInfiniteCycleGuard();
    while (currentNode !== undefined) {
        guard.iteration();

        currentNode = getParentNode(currentNode, model);
        if (currentNode !== undefined && predicate(currentNode)) {
            return currentNode as T;
        }
    }
    return undefined;
}

export function findParentNodeByType<T extends MNode>(
    node: MNode,
    model: Model,
    type: MNodeType
): T | undefined {
    return findParentNode(node, model, n => n.type === type);
}

export function validateAggregation(
    aggregation: MAggregationNode,
    model: Model
): Result<MAggregationNode> {
    if (aggregation.inputNode === undefined) {
        return {successful: false, message: 'Please provide input'};
    }
    const tableNode = findParentNodeByType<MTableNode>(aggregation, model, MNodeType.table);
    if (tableNode?.table === undefined) {
        // TODO
    }
    if (aggregation.func === undefined) {
        return {successful: false, message: 'Please select function'};
    }
    if (aggregation.column === undefined) {
        return {successful: false, message: 'Please select column'};
    }
    return {successful: true, data: aggregation};
}
