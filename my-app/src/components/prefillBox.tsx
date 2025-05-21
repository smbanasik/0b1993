// Spencer Banasik
// PrefillBox
// This box is to recieve the forms and edges to manage the
// prefill viewing and editing
import React, {useEffect, useState} from 'react';
import { ViewBox } from './viewBox';
import styles from './prefill.module.css'

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

interface Mapping {
    downstreamElem: string,
    upstreamElem: string,
}

interface FormMapping {
    formID: string,
    mApprovalRequired: Mapping,
    mApprovalRoles: Mapping,
    mComponentID: Mapping,
    mComponentKey: Mapping,
    mComponentType: Mapping,
    mID: Mapping,
    mInputMapping: Mapping,
    mName: Mapping
    mPermittedRoles: Mapping,
    mPrerequisites: Mapping
    mSLADuration: Mapping
}
// TODO:
// PrefillBox will have: a view box, and an edit box
// The view box will have: a drop down to select forms, a list of mappings
// a way to clear a mapping, and a way to select a piece of data for the edit box

// The form should only be able to prefill based on chains above it, for any form we need to traverse the DAG.
export function handleNewMapping() {

}

// How is information passed:
// Prefill box - List of mappings, a form to be edited
// View box - sends a property and the form associated with it
// Edit box - returns the selection that the user made

export function PrefillBox({edges, nodes}: PrefillBoxProps) {


    const [formMappings, setFormMappings] = useState<Array<FormMapping>>();
    const [isView, setIsView] = useState<boolean>(true);

    return(
        <div className={styles.prefillBox}>
            {isView ? <ViewBox nodes={nodes}/> : <p>I'm the edit box!</p>}
        </div>
    );
}