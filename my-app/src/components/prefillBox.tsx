// Spencer Banasik
// PrefillBox
// This box is to recieve the forms and edges to manage the
// prefill viewing and editing
import React, {useEffect, useState} from 'react';
import { ViewBox } from './viewBox';
import styles from './prefill.module.css'
import { EditMappingsBox } from './editBox';

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

export interface NodeData {
    approval_required: boolean,
    approval_roles: Array<object>,
    component_id: string,
    component_key: string,
    component_type: string,
    id: string,
    input_mapping: object,
    name: string,
    permitted_roles: Array<object>
    prerequisites: Array<string>
    sla_duration: object
}

export interface Node {
    data: NodeData,
    id: string,
    position: object,
    type:string
}

export interface PrefillBoxProps {
    edges: Array<Edge>
    nodes: Array<Node>
}

export class FormMapping {

    constructor(ID:string) {
        this.formID = ID;
    }
    formID?: string = "";
    approval_required?: string = "";
    approval_roles?: string = "";
    component_id?: string = "";
    component_key?: string = "";
    component_type?: string = "";
    id?: string = "";
    input_mapping?: string = "";
    name?: string = "";
    permitted_roles?: string = "";
    prerequisites?: string = "";
    sla_duration?: string = "";
}
// TODO:
// PrefillBox will have: a view box, and an edit box
// The view box will have: a drop down to select forms, a list of mappings
// a way to clear a mapping, and a way to select a piece of data for the edit box

// How is information passed:
// Prefill box - List of mappings, a form to be edited
// View box - sends a property and the form associated with it
// Edit box - returns the selection that the user made

export function PrefillBox({edges, nodes}: PrefillBoxProps) {

    const [formMappings, setFormMappings] = useState<Array<FormMapping>>([]);
    const [isView, setIsView] = useState<boolean>(true);
    const [newMappingSrc, setNewMappingSrc] = useState<string>("");
    const [newMappingEntry, setNewMappingEntry] = useState<string>("");

    if(formMappings.length === 0) {

        const initMappings = nodes.map((node, i) => 
            ({
                formID: node.id,
                id: "Test " + i
            }));
        setFormMappings(prev => [...prev, ...initMappings]);
    }

    function handleNewMapping(formID: string, entry: string, clearMapping: boolean) {

        const newMappings = [...formMappings]
        const nodeMapping = newMappings.find(form => form.formID === formID);

        if(nodeMapping == null) {
            throw new Error("Could not find form requested by premapping view box!");
        }
        
        // With the entry found for our mapping data, we want to mutate this data
        // and either clear it or call the editBox with the form

        if(clearMapping) {
            const mappingEntries = Object.entries(nodeMapping);

            mappingEntries.forEach(element => {
                if(element[0] === entry) {
                    element[1] = "";
                }
            });

            const idx = newMappings.findIndex(form => form.formID === formID);

            newMappings[idx] = Object.fromEntries(mappingEntries);

            setFormMappings([...newMappings]);

        } else {
            // If we aren't clearing, we go to the edit box.
            setNewMappingSrc(formID);
            setNewMappingEntry(entry);
            setIsView(false);
        }

    }

    function handleNewMappingComplete(entry: string) {
        // No matter what, we're always returning
        setIsView(true);
        if(entry === "")
            return;

        const newMappings = [...formMappings]
        const nodeMapping = newMappings.find(form => form.formID === newMappingSrc);
        if(nodeMapping == null) {
            throw new Error("Could not find form required by new mapping completion!");
        }

        const mappingEntries = Object.entries(nodeMapping);

        mappingEntries.forEach(element => {
            if(element[0] === newMappingEntry) {
                element[1] = entry;
            }
        });

        const idx = newMappings.findIndex(form => form.formID === newMappingSrc);

        newMappings[idx] = Object.fromEntries(mappingEntries);

        setFormMappings([...newMappings]);
    }

    return(
        <div className={styles.prefillBox}>
            {isView ? <ViewBox 
            nodes={nodes} 
            handleNewMapping={handleNewMapping}
            mappings={formMappings}
            />
            : <EditMappingsBox
                edges={edges}
                forms={nodes}
                source={newMappingSrc}
                handleCompletionCallback={handleNewMappingComplete} />
            }
        </div>
    );
}