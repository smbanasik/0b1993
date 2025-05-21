import { Edge, Node } from "./prefillBox"

export {}



// Returns direct and transietive mappings (so, anything upstream of it)
function traverseEdges(source: string, edges: Array<Edge>) {

    // TODO: given a list of edges, match everything with our source
    // Then look for ones upstream of those matches
    // To prevent circular dependency issues, only look upstream if it's a new addition

}

interface EditMappingsBoxProps {
    edges: Array<Edge>,
    forms: Array<Node>,
    source: Node
}


// TODO: a list of selectable forms on the left that can be scrolled,
// When selected, we get their properties on the right that can be selected
// Takes the edges, forms, and a source form
// Outputs Formname.Property to parent
function EditMappingsBox({}) {

    


}