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
    edges: Array<Edge>,
    nodes: Array<Node>,
    globalData: Array<Node>
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

export function PrefillBox({edges, nodes, globalData}: PrefillBoxProps) {

    const [formMappings, setFormMappings] = useState<Array<FormMapping>>([]);
    const [isView, setIsView] = useState<boolean>(true);
    const [newMappingSrc, setNewMappingSrc] = useState<string>("");
    const [newMappingEntry, setNewMappingEntry] = useState<string>("");

    if(formMappings.length === 0) {

        const initMappings = nodes.map((node, i) => 
            ({
                formID: node.id,
                id: "",
                approval_required: "",
                approval_roles: "",
                component_id: "",
                component_key: "",
                component_type: "",
                input_mapping: "",
                name: "",
                permitted_roles: "",
                prerequisites: "",
                sla_duration: "",
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
        
        console.log(newMappings);

        setFormMappings([...newMappings]);
    }

    return(
        <div className={styles.prefillBox}>
            {isView ? <ViewBox 
            nodes={nodes}
            handleNewMapping={handleNewMapping}
            mappings={formMappings}
            lastNode={newMappingSrc}
            />
            : <EditMappingsBox
                edges={edges}
                forms={nodes}
                source={newMappingSrc}
                globalData={globalData}
                handleCompletionCallback={handleNewMappingComplete} />
            }
        </div>
    );
}