import {FilterNode} from './FilterNode';
import React, {CSSProperties} from 'react';
import {NodeProps} from 'react-flow-renderer';
import classNames from 'classnames';
import {TableNode} from './TableNode';
import {ResultNode} from './ResultNode';
import {MNodeType} from '../../model';

export const nodeTypes = {
    [MNodeType.table]: TableNode,
    [MNodeType.filter]: FilterNode,
    [MNodeType.result]: ResultNode,
};

export function createNode<T>(component: React.FC<NodeProps<T>>, style?: CSSProperties) {
    return (props: NodeProps<T>) => {
        return (
            <div style={style} className={classNames('node', {'node-selected': props.selected})}>
                {component(props)}
            </div>
        );
    };
}
