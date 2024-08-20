import {
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
    XYPosition,
  } from '@xyflow/react';
import { nanoid } from 'nanoid';

import { createWithEqualityFn } from 'zustand/traditional';

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addChildNode : (parentNode: Node, position: XYPosition) => void;
  updateNodeLabel : (nodeId: string, label: string) => void;
  getParents: (nodeId: string) => Array<string>;
};

var nodeCount = 1

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      type: 'mindmap',
      data: { label: 'React Flow Mind Map', parents: []},
      position: { x: 0, y: 0 },
    },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addChildNode: (parentNode: Node, position: XYPosition) => {
    const newParents= parentNode.data.parents as Array<string>
    const newNode = {
      id: nanoid(),
      type: 'mindmap',
      data: { 
        label: `New Node ${nodeCount}`, 
        parents: [...newParents, parentNode.data.label]
      },
      position,
      parentNode: parentNode.id,
    };

    nodeCount+=1;
   
    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };
   
    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new object here, to inform React Flow about the changes
          node.data = { ...node.data, label };
        }
   
        return node;
      }),
    });
  },
  getParents: (nodeId: string) => {
    const parentNodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        return node.data.parents;
      }
    })

    return parentNodes[parentNodes.length - 1] as Array<string>;
  }
}));
 
export default useStore;
 