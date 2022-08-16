import {OrderBy, Query, Select, Where} from './queryModel';
import {
    findParentNodeByType,
    getParentNode,
    MColumnsNode,
    MFilterNode,
    MNode,
    MNodeType,
    Model,
    MSortNode,
    MTableNode,
} from '../model';
import {map, Result} from '../result';
import {WhileLoopInfiniteCycleGuard} from '../utils';

function find<T extends MNode>(node: MNode, type: MNodeType, model: Model): T[] {
    const result: T[] = [];
    let currentNode: MNode | undefined = node;
    const guard = new WhileLoopInfiniteCycleGuard();
    while (currentNode !== undefined) {
        guard.iteration();
        if (currentNode.type === type) {
            result.push(currentNode as T);
        }
        currentNode = findParentNodeByType(currentNode, model, type);
    }

    return result;
}

function buildSelect(node: MNode, model: Model): Result<Select> {
    const table: MTableNode | undefined = find(node, MNodeType.table, model)[0] as MTableNode;
    if (table?.table === undefined) {
        return {successful: false, message: 'Please select table'};
    }
    const columnNodes = find<MColumnsNode>(node, MNodeType.columns, model).reverse();
    const columns = columnNodes.map(c => c.selectedColumns).flat();

    return {
        successful: true,
        data: {
            table: table.table,
            columns,
        },
    };
}

function buildWhere(node: MNode, model: Model): Where {
    const filterNodes = find<MFilterNode>(node, MNodeType.filter, model).reverse();
    const filters = filterNodes.map(f => f.filter.trim()).filter(f => f.length > 0);
    return {filters};
}

function buildOrderBy(node: MNode, model: Model): OrderBy {
    const sortNodes = find<MSortNode>(node, MNodeType.sort, model).reverse();
    const columns = sortNodes.map(n => n.selectedColumns).flat();
    const directions = sortNodes.map(n => n.sortDirections).flat();
    return {columns, directions};
}

export function generateQuery(nodeId: string, model: Model): Result<Query> {
    const node = model.find(n => n.id === nodeId)!;
    const select = buildSelect(node, model);
    return map(select, s => {
        return {select: s, where: buildWhere(node, model), orderBy: buildOrderBy(node, model)};
    });
}
