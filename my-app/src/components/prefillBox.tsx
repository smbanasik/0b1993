// Spencer Banasik
// PrefillBox
// This box is to recieve the forms and edges to manage the
// prefill viewing and editing
import React, {useEffect, useState} from 'react';

export interface Edge {
    source: string,
    target: string
}
export interface Form {
    id: string,
    name: string,
    description: string,
    dynamic_field_config: object,
    field_schema: object,
    is_resuable: boolean,
    ui_schema: object
}

export interface Node {
    data: object,
    id: string,
    position: object,
    type:string
}

export interface PrefillBoxProps {
    edges: Array<Edge>
    nodes: Array<Node>
}

// We now want to display the forms for each data.
// Ideally we should have some sort of drop down so we can view the forms!

export function PrefillBox({edges, nodes}: PrefillBoxProps) {

    const formItems = nodes.map(node => 
    <React.Fragment>
        <h1>{node.type}</h1>
        <ul>
            <li>{node.id}</li>
        </ul>
        </React.Fragment>)

    return(
        <div>
            {formItems}
        </div>
    );
}