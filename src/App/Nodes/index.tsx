import React from 'react';

import { Handle, NodeProps, Position, Node } from '@xyflow/react';

import useStore from '../NodeStorage'

import {TableOfContents} from '@carbon/icons-react'

import { OverflowMenu, OverflowMenuItem } from '@carbon/react';
 
export type NodeData = {
  label: string;
};
 
const Nodes = ({ id, data }: NodeProps<Node<NodeData>>) => {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const getParents = useStore((state) => state.getParents);
  var parents = getParents(id);
  return (
    <div className='nodeContents'>
      <input 
        className = "nodeText" 
        defaultValue={data.label}
        onChange={(evt) => updateNodeLabel(id, evt.target.value)}
      />
      <div className='Menu'>
        {parents && parents.length > 0 &&
          <OverflowMenu
            renderIcon={TableOfContents}
            flipped={document?.dir === 'rtl'}
          >
            {parents.map((item) => {
                return <OverflowMenuItem itemText = {item}/>
            })}
          </OverflowMenu>
        }
      </div>
      
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
 
export default Nodes;