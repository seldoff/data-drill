import ReactFlow, {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    useEdgesState,
    useNodesState,
} from 'react-flow-renderer';
import {nodeTypes} from './nodes/common';
import {modelActions, useDispatch, useSelector} from '../redux/store';
import {Node, NodeDragHandler, OnConnect} from 'react-flow-renderer/dist/esm/types';
import {useCallback, useEffect} from 'react';
import {NodeUpdate} from '../redux/model';
import {Connection} from 'react-flow-renderer/dist/esm/types/general';
import {getInputNode} from '../model';
import {uuid} from '../utils';

export function Flow() {
    const mNodes = useSelector(s => s.model.nodes);
    const dispatch = useDispatch();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

        setEdges(edges => {
            const connections = mNodes
                .map(n => {
                    const inputNode = getInputNode(n);
                    return inputNode !== undefined ? {source: inputNode, target: n.id} : undefined;
                })
                .filter(c => c !== undefined)
                .map(c => c!);

            const removedEdges = new Set(
                edges
                    .filter(
                        e =>
                            connections.findIndex(
                                c => c.source === e.source && c.target === e.target
                            ) === -1
                    )
                    .map(e => e.id)
            );

            const addedEdges: Edge[] = [];
            for (const node of mNodes) {
                const inputNode = getInputNode(node);
                if (inputNode === undefined) {
                    continue;
                }
                const edge = edges.find(e => e.source === inputNode && e.target === node.id);
                if (edge === undefined) {
                    addedEdges.push({
                        id: uuid(),
                        source: inputNode,
                        target: node.id,
                    });
                }
            }

            if (removedEdges.size === 0 && addedEdges.length === 0) {
                return edges;
            }

            let newEdges = edges.filter(e => !removedEdges.has(e.id));
            newEdges = newEdges.concat(addedEdges);
            return newEdges;
        });
    }, [mNodes, setNodes, setEdges]);

    const onNodeDragStop = useCallback<NodeDragHandler>(
        (_, __, nodes) => {
            const updates: NodeUpdate[] = nodes
                .filter(n => n.position !== undefined)
                .map(n => ({id: n.id, position: n.position}));
            dispatch(modelActions.updateNodes(updates));
        },
        [dispatch]
    );

    const onConnect = useCallback<OnConnect>(
        (conn: Connection) => {
            dispatch(modelActions.updateNodes([{id: conn.target!, inputNode: conn.source!}]));
            setEdges(edges => addEdge(conn, edges));
        },
        [dispatch, setEdges]
    );

    return (
        <>
            <ReactFlow
                defaultZoom={1.2}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onNodeDragStop={onNodeDragStop}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Controls />
                <Background variant={BackgroundVariant.Lines} />
            </ReactFlow>
        </>
    );
}
