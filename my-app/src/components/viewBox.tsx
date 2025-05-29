import { Node, NodeData } from "./prefillBox"
import React, {useEffect, useState} from 'react';
import styles from './prefill.module.css'

import {FormMapping} from './prefillBox'

interface ViewBoxProps {
    nodes: Array<Node>
    handleNewMapping: Function
    mappings: Array<FormMapping>
    lastNode: string
}
interface FormSelectorProps {
    nodes: Array<NodeData>,
    sendSelectedNode: Function
}

interface NodeDisplayProps {
    node: NodeData,
    mapping: FormMapping,
    clearMapFunction: Function,
    addMapFunction: Function,
}

// Have a drop down to select which form to display
function FormSelector({nodes, sendSelectedNode}: FormSelectorProps) {
    
    const options = nodes.map(node => <option value={node.component_key} key={node.component_key}>{node.name}</option>)
    
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        const foundElement = nodes.find(node => formJson.selectedForm === node.component_key);
        sendSelectedNode(foundElement);
    }

    return (
    <div className={styles.prefillEntry}>
        <form method="post" onSubmit={handleSubmit}>
            <label>
                Select form to veiw/edit:
                <select name="selectedForm" defaultValue={nodes[0].component_key}>
                    {options}
                </select>
                <button type="submit">Submit</button>
            </label>
        </form>
    </div>
    )
}

// Return a list of text boxes with node data, as well as buttons
// https://react.dev/reference/react-dom/components/textarea#controlling-a-text-area-with-a-state-variable
function DataDisplay({node, mapping, clearMapFunction, addMapFunction}: NodeDisplayProps) {

    // Given a node, output its form contents as text boxes and a button next to it
    const nodeEntries = Object.entries(node);
    const mappingEntries = Object.entries(mapping);

    const prefillItems = nodeEntries.map(entry=> {

        const associatedEntry = mappingEntries.find(mEntry => mEntry[0] === entry[0]);

        return (
        <div className={styles.prefillEntry} key={entry[0]}>
            <label className={styles.prefillEntryBox}
                onClick={e => {
                    e.stopPropagation();
                    addMapFunction(entry[0])
                }}>
                {entry[0]}: {associatedEntry?.[1]}
            </label>
            <button onClick={e => {
                e.stopPropagation();
                clearMapFunction(entry[0])
            }}>X</button>
        </div>
        )
    }
    )
    return (
        <div>
            Now editing form {node.name}
            {prefillItems}
        </div>
    )
}

function objectChanged(mappingOne: Record<string, unknown>, mappingTwo: Record<string, unknown>) {
    const mapKeys = Object.keys(mappingOne);

    for(const key of mapKeys) {
        if(mappingOne[key] !== mappingTwo[key]) {
            return true;
        }
    }
    return false;
}

// Have a drop down to select different forms for the data display
export function ViewBox({nodes, handleNewMapping, mappings, lastNode}: ViewBoxProps) {
    
    // For every node, access their data and extract their name
    const nodeData = nodes.map(node =>
        node.data
    )

    const initialNode = (lastNode === "" ? nodes[0].data : 
        () => {
            for(let idx: number = 0; idx < nodes.length; idx++) {
                if(lastNode === nodes[idx].id) {
                    return nodes[idx].data;
                }
            }
            return nodes[0].data;
        }
    )
    const inialMappings = (lastNode === "" ? mappings[0] : 
        () => {
            for(let idx: number = 0; idx < mappings.length; idx++) {
                if(lastNode === mappings[idx].formID)
                    return mappings[idx];
            }
            return mappings[0];
        }
    )

    // TODO: always defaults to form F when we cancel or bind a mapping,
    // need to change in parent component and here.
    const [selectedNode, setSelectedNode] = useState<NodeData>(initialNode);
    const [selectedMapping, setSelectedMapping] = useState<FormMapping>(inialMappings);

    // Update selected mapping in case anything has changed
    const mapping = mappings.find(mapping => mapping.formID === selectedMapping.formID)
    if(mapping == null)
        throw new Error("Mappings not aligned in view box.");
    if(objectChanged({...mapping}, {...selectedMapping})) {
        setSelectedMapping(mapping);
    } 

    function handleSelectedNode(newSelectedNode: NodeData) {
        setSelectedNode(newSelectedNode);
        const mapping = mappings.find(mapping => {
            return (mapping.formID === newSelectedNode.component_key)
         });
        if(mapping == null) {
            throw new Error("Could not find form for view box selected mapping!");
        }
        setSelectedMapping(mapping);
    }

    function handleEntryClear(entry: string) {
        handleNewMapping(selectedNode.component_key, entry, true);
    }

    function handleEntryNew(entry: string) {
        handleNewMapping(selectedNode.component_key, entry, false);
    }

    return (<div> <FormSelector nodes={nodeData} sendSelectedNode={handleSelectedNode}/>
    <DataDisplay node={selectedNode}
                mapping={selectedMapping}
                clearMapFunction={handleEntryClear}
                addMapFunction={handleEntryNew}/>
    </div>)
}
