import React, {Fragment, useEffect, useState} from 'react';
import { Edge, Node } from "./prefillBox"
import styles from './prefill.module.css'

// Returns direct and transietive mappings (so, anything upstream of it)
function traverseEdges(source: string, edges: Array<Edge>) {

    let validForms : Set<string> = new Set<string>();

    validForms.add(source);

    let foundElem = true;
    while(foundElem) {
        foundElem = false;
        for(let idx : number = 0; idx < edges.length; idx++) {
            if(validForms.has(edges[idx].target) 
                && !validForms.has(edges[idx].source)) {
                foundElem = true;
                validForms.add(edges[idx].source);
            }
        }
    }
    
    validForms.delete(source);

    let retForms = Array.from(validForms);

    return retForms;
}

function getNodes(keyNames: Array<string>, forms: Array<Node>) {

    let validNodes : Array<Node> = [];
    for(let name: number = 0; name < keyNames.length; name++) {
        for(let form: number = 0; form < forms.length; form++) {

            if(keyNames[name] === forms[form].id) {
                validNodes.push(forms[form]);
            }
        }
    }

    return validNodes;
}

interface ValidFormsBoxProps {
    forms: Array<Node>
    callback: Function
}

function ListValidForms({forms, callback}: ValidFormsBoxProps) {

    const formNames = forms.map(form => 
        <label 
        key = {form.id}
        className = {styles.prefillEditBoxEntry}
        onClick = {e => {
            e.stopPropagation();
            callback(form);
        }}>{form.data.name}</label>
    )

    return (
        <div className = {styles.prefillEditBoxColumnLeft}>
            {formNames}
        </div>
    );
}

interface ListMappingsProps {
    selectedForm: Node
    callback: Function
}

// Going to be very similar to display data
function ListMappings({selectedForm, callback}: ListMappingsProps) {

    // Given a selected form, display all of its stuff
    const nodeEntries = Object.entries(selectedForm.data);

    const prefillItems = nodeEntries.map(entry=> {
        return (
            <div key={entry[0]}>
            <label className={styles.prefillEditBoxEntry}
                onClick={e => {
                    e.stopPropagation();
                    callback(entry[0]);
                }}>
                {entry[0]}
            </label>
            <br/>
            </div>
        )
    }
    )

    return (
        <div>
            Selected Form: {selectedForm.data.name}
            <br/>
            {prefillItems}
        </div>
    )
}

interface EditMappingsBoxProps {
    edges: Array<Edge>,
    forms: Array<Node>,
    source: string,
    handleCompletionCallback: Function,
}

// When selected, we get their properties on the right that can be selected
// Takes the edges, forms, and a source form
// Outputs Formname.Property to parent
export function EditMappingsBox({edges, forms, source, handleCompletionCallback}: EditMappingsBoxProps) {

    const [selectedFormKey, setSelectedFormKey] = useState<string>("");
    const [selectedForm, setSelectedForm] = useState<Node>(forms[0]);

    function getSelectedForm(form: Node) {
        setSelectedFormKey(form.id)
        setSelectedForm(form)
    }

    function getSelectedMapping(mapping : string) {
        setSelectedFormKey("");
        handleCompletionCallback(selectedForm.data.name + "." + mapping);
    }

    const validForms = traverseEdges(source, edges);
    const validNodes = getNodes(validForms, forms);

    return (
        <div className={styles.prefillEditBox}>
            <div className={styles.prefillEditBoxColumns}>

            <ListValidForms forms={validNodes}
                callback={getSelectedForm}/>
            {(selectedFormKey === "") 
            ? <p>Select a form to the left.</p> 
            : <ListMappings selectedForm={selectedForm}
            callback={getSelectedMapping}/>}
            </div>
            <button onClick={e => {
                    e.stopPropagation();
                    handleCompletionCallback("");
                }}>Cancel</button>
        </div>
    )
}