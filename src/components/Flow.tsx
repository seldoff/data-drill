import ReactFlow, {
    applyNodeChanges,
    Background,
    BackgroundVariant,
    Controls,
} from 'react-flow-renderer';
import {nodeTypes} from './nodes/common';
import {modelActions, useDispatch, useSelector} from '../redux/store';
import {Node, NodeDragHandler, OnNodesChange} from 'react-flow-renderer/dist/esm/types';
import {useCallback, useEffect, useState} from 'react';
import {NodeChange} from 'react-flow-renderer/dist/esm/types/changes';
import {NodeUpdate} from '../redux/model';

export function Flow() {
    const mNodes = useSelector(s => s.model.nodes);
    const dispatch = useDispatch();

    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        setNodes(nodes => {
            const removedNodes = new Map(
                nodes.filter(n => mNodes.findIndex(mn => mn.id === n.id) === -1).map(n => [n.id, n])
            );
            const updatedNodes = new Map<string, Node>();
            const addedNodes: Node[] = [];
            for (const mNode of mNodes) {
                const node = nodes.find(n => n.id === mNode.id);
                if (node !== undefined) {
                    if (node.data !== mNode) {
                        updatedNodes.set(mNode.id, {
                            ...node,
                            data: mNode,
                        });
                    }
                } else {
                    addedNodes.push({
                        id: mNode.id,
                        type: mNode.type,
                        position: mNode.position,
                        data: mNode,
                    });
                }
            }

            if (removedNodes.size === 0 && updatedNodes.size === 0 && addedNodes.length === 0) {
                return nodes;
            }

            let newNodes = nodes.filter(n => !removedNodes.has(n.id));
            newNodes = newNodes.map(n => updatedNodes.get(n.id) ?? n);
            newNodes = newNodes.concat(addedNodes);

            return newNodes;
        });
    }, [mNodes]);

    const onNodesChange = useCallback<OnNodesChange>(
        (changes: NodeChange[]) => setNodes(nodes => applyNodeChanges(changes, nodes)),
        []
    );

    const onNodeDragStop = useCallback<NodeDragHandler>(
        (_, __, nodes) => {
            const updates: NodeUpdate[] = nodes
                .filter(n => n.position !== undefined)
                .map(n => ({id: n.id, position: n.position}));
            dispatch(modelActions.updateNodes(updates));
        },
        [dispatch]
    );

    return (
        <>
            <ReactFlow
                defaultZoom={1.2}
                nodeTypes={nodeTypes}
                nodes={nodes}
                onNodesChange={onNodesChange}
                onNodeDragStop={onNodeDragStop}
            >
                <Controls />
                <Background variant={BackgroundVariant.Lines} />
            </ReactFlow>
        </>
    );
}
