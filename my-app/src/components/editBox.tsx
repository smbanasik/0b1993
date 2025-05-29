import React, {useEffect, useState} from 'react';
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
        for(let form: number = 0; name < forms.length; form++) {
            
            if(keyNames[name] === forms[form].id) {
                validNodes.push(forms[form]);
            }
        }
    }

    return validNodes;
}

interface EditMappingsBoxProps {
    edges: Array<Edge>,
    forms: Array<Node>,
    source: string,
    handleCompletionCallback: Function,
}

interface ValidFormsBoxProps {
    forms: Array<Node>
}

function ListValidForms({forms}: ValidFormsBoxProps) {

    const formNames = forms.map(form => 
        <label className = {styles.prefillEditBoxEntry}>{form.data.name}</label>
    )

    return (
        <div className = {styles.prefillEditBoxColumnLeft}>
            {formNames}
        </div>
    );
}

interface ListMappingsProps {
    selectedForm: Node
}

function ListMappings({selectedForm}: ListMappingsProps) {

    
}

// What's left? traverseEdges, the UI, then sending that info back.


// TODO: a list of selectable forms on the left that can be scrolled,
// When selected, we get their properties on the right that can be selected
// Takes the edges, forms, and a source form
// Outputs Formname.Property to parent
export function EditMappingsBox({edges, forms, source, handleCompletionCallback}: EditMappingsBoxProps) {

    // TODO: left column options
    // TODO: right column display
    // TODO: cancel button

    const validForms = traverseEdges(source, edges);
    const validNodes = getNodes(validForms, forms);


    return (
        <div className={styles.prefillEditBox}>
            <div className={styles.prefillEditBoxColumns}>

            <ListValidForms forms={validNodes}/>
            <p>Test</p>
            </div>
            <button onClick={e => {
                    e.stopPropagation();
                    handleCompletionCallback("");
                }}>Cancel</button>
        </div>
    )
}