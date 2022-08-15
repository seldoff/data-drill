import {FilterNode} from './FilterNode';
import React, {CSSProperties} from 'react';
import {NodeProps} from 'react-flow-renderer';
import classNames from 'classnames';
import {TableNode} from './TableNode';
import {ResultNode} from './ResultNode';
import {MNodeType} from '../../model';
import {ColumnsNode} from './ColumnsNode';

export const nodeTypes = {
    [MNodeType.table]: TableNode,
    [MNodeType.filter]: FilterNode,
    [MNodeType.result]: ResultNode,
    [MNodeType.columns]: ColumnsNode,
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
