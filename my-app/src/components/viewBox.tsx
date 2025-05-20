import { Node, NodeData } from "./prefillBox"
import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
// The view box will have: a drop down to select forms, a list of mappings

interface ViewBoxProps {
    nodes: Array<Node>
}
interface NodeDisplayProps {
    node: NodeData
}

// Return a list of text boxes with node data
function DataDisplay({node}: NodeDisplayProps) {
    return (<p>Displaying Data of {node.name}</p>)
}

function FormSelector() {
    return (
    <div>
        <Button variant="contained">Form Selector Button</Button>
    <p>Form Selector</p>
    </div>
)
}

// Have a drop down to select different forms for the data display
export function ViewBox({nodes}: ViewBoxProps) {
    
    // For every node, access their data and extract their name
    const nodeNames = nodes.map(node =>
        <p key={node.id}>{node.data.name}</p>
    )
    
    return (<div> <FormSelector />
    <DataDisplay node={nodes[0].data}/>
    </div>)
}