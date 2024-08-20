import { useCallback, useRef } from 'react';
import { ReactFlow, Controls, Panel, NodeOrigin, OnConnectStart, OnConnectEnd, useStoreApi, InternalNode, ConnectionLineType, useReactFlow } from '@xyflow/react';
import { shallow } from 'zustand/shallow';
 // we have to import the React Flow styles for it to work
import '@xyflow/react/dist/style.css';

import useStore, {RFState} from './NodeStorage'

import Nodes from './Nodes';
import Edges from './Edges';
 
const nodeTypes = {
  mindmap: Nodes,
};
 
const edgeTypes = {
  mindmap: Edges,
};

const selector = (state: RFState) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    addChildNode : state.addChildNode,
});

const nodeOrigin: NodeOrigin = [0.5, 0.5];
const connectionLineStyle = { stroke: 'black', strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: 'mindmap' };


function Flow() {

    const { nodes, edges, onNodesChange, onEdgesChange, addChildNode } = useStore(
        selector,
        shallow,
    );

    const connectingNodeId = useRef<string | null>(null);

    const store = useStoreApi();

    const { screenToFlowPosition } = useReactFlow();

    const getChildNodePosition = (event: MouseEvent, parentNode?: InternalNode) => {
        const { domNode } = store.getState();
       
        if (
          !domNode ||
          // we need to check if these properites exist, because when a node is not initialized yet,
          // it doesn't have a positionAbsolute nor a width or height
          !parentNode?.internals?.positionAbsolute ||
          !parentNode?.measured?.width ||
          !parentNode?.measured?.height
        ) {
          return;
        }
       
        const panePosition = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
       
        // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
        return {
          x:
            panePosition.x -
            parentNode.internals?.positionAbsolute.x +
            parentNode.measured?.width / 2,
          y:
            panePosition.y -
            parentNode.internals?.positionAbsolute.y +
            parentNode.measured?.height / 2,
        };
      };
    
    const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
        connectingNodeId.current = nodeId;
      }, []);
    
    const onConnectEnd: OnConnectEnd = useCallback((event) => {
        const { nodeLookup } = store.getState();
        const targetIsPane = (event.target as Element).classList.contains(
            'react-flow__pane',
        );
    
        if (targetIsPane && connectingNodeId.current) {
            console.log(`add new node with parent node ${connectingNodeId.current}`);
    
            const parentNode = nodeLookup.get(connectingNodeId.current);
            const childNodePosition = getChildNodePosition(event, parentNode);
       
            if (parentNode && childNodePosition) {
              addChildNode(parentNode, childNodePosition);
            }
        }
    
    }, [getChildNodePosition]);
    
    return (
        <ReactFlow
            nodes = {nodes}
            edges = {edges}
            nodeTypes = {nodeTypes}
            edgeTypes = {edgeTypes}
            onNodesChange = {onNodesChange}
            onEdgesChange = {onEdgesChange}
            nodeOrigin = {nodeOrigin}
            fitView
            onConnectStart = {onConnectStart}
            onConnectEnd = {onConnectEnd}
            connectionLineStyle = {connectionLineStyle}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.Straight}
        >
        <Controls showInteractive={false} />
        <Panel position="top-left">React Flow Mind Map</Panel>
        </ReactFlow>
    );
}
 
export default Flow;

/*function screenToFlowPosition(arg0: { x: number; y: number; }) {
    throw new Error('Function not implemented.');
}
function addChildNode(parentNode: InternalNode<Node>, childNodePosition: { x: number; y: number; }) {
    throw new Error('Function not implemented.');
}*/

