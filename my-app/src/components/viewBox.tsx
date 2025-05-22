import { Node, NodeData } from "./prefillBox"
import React, {useEffect, useState} from 'react';
import styles from './prefill.module.css'

interface ViewBoxProps {
    nodes: Array<Node>
    handleNewMapping: Function
}
interface FormSelectorProps {
    nodes: Array<NodeData>,
    sendSelectedNode: Function
}

interface NodeDisplayProps {
    node: NodeData,
    clearMapFunction: Function,
    addMapFunction: Function,
}

// Have a drop down to select which form to display
function FormSelector({nodes, sendSelectedNode}: FormSelectorProps) {
    
    const options = nodes.map(node => <option value={node.component_key}>{node.name}</option>)
    
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson.selectedForm);

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
function DataDisplay({node, clearMapFunction, addMapFunction}: NodeDisplayProps) {

    // Given a node, output its form contents as text boxes and a button next to it
    const nodeEntries = Object.entries(node);

    const prefillItems = nodeEntries.map(entry=> 
        <div className={styles.prefillEntry} key={entry[0]}>
            <label className={styles.prefillEntryBox}
                onClick={e => {
                    e.stopPropagation();
                    addMapFunction(entry[0])
                }}>
                {entry[0]}: 
            </label>
            <button onClick={e => {
                e.stopPropagation();
                clearMapFunction(entry[0])
            }}>X</button>
        </div>
    )
    return (
        <div>
            Now editing form {node.name}
            {prefillItems}
        </div>
    )
}

// Have a drop down to select different forms for the data display
export function ViewBox({nodes, handleNewMapping}: ViewBoxProps) {
    
    // For every node, access their data and extract their name
    const nodeData = nodes.map(node =>
        node.data
    )
    const [selectedNode, setSelectedNode] = useState<NodeData>(nodes[0].data);

    function handleSelectedNode(selectedNode: NodeData) {
        setSelectedNode(selectedNode);
    }

    function handleEntryClear(entry: string) {
        handleNewMapping(selectedNode.component_key, entry, true);
    }

    function handleEntryNew(entry: string) {
        handleNewMapping(selectedNode.component_key, entry, false);
    }
    
    return (<div> <FormSelector nodes={nodeData} sendSelectedNode={handleSelectedNode}/>
    <DataDisplay node={selectedNode} 
                clearMapFunction={handleEntryClear}
                addMapFunction={handleEntryNew}/>
    </div>)
}
