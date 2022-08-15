import {FilterNode} from './FilterNode';
import React from 'react';
import {NodeProps} from 'react-flow-renderer';
import classNames from 'classnames';
import {TableNode} from './TableNode';

export const nodeTypes = {table: TableNode, filter: FilterNode};

export function createNode<T>(component: React.FC<NodeProps<T>>) {
    return (props: NodeProps<T>) => {
        return (
            <div className={classNames('node', {'node-selected': props.selected})}>
                {component(props)}
            </div>
        );
    };
}
