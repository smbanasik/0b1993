# Avantos Challenge Submission Write up

## Usage
To run, first ensure the frontend server provided by Avantos is running.
Next, cd to `my-app` and type `npm start`. If you would like to change the port, edit the `.env` file in the directory. The default port is `3006`.

## Code Architecture

The project's components are found under `./src/components`. The main component is found in `prefillBox.tsx` which acts as a parent to the subcomponents. It is fed data through the `App.tsx`, which makes the API request to the test server and acquires data. Additional data sources (such as for requirement 3) should be added through the global section, which is the same format as the nodes.

The PrefillBox keeps track of state between the viewing and editing of mappings, as well as keeps track of the mappings themselves. Any changes to the interface between the subcomponents should start here.

The ViewBox, found in `viewbox.tsx` handles the form selection and display of the data and mappings. This has two subcomponents which are named FormSelector and DataDisplay, which perform the previously mentioned aspects. The viewbox detects that the user wants to set or clear a mapping and communicates this to the PrefillBox.

The EditBox, found in `editbox.tsx` is swapped to once the PrefillBox has recieved that the user wants to set a mapping. This is a separate menu which, depending on which form was selected in the ViewBox, will find valid forms that satisfy requirements 1 and 2 of the prefill data sources. These are then merged with any additional data that came from source 3. Once an option on the left is selected, the right column is populated with options and the selection can be made.

## Post Project Thoughts

### Process
This was my first react project and in spite of the difficulties faced, I am happy with what I accomplished as a first project. The first day was spent learning the fundamentals of React and JSX. My background in other languages (C++, Java, Python) allowed me to pick things up quickly, but there was still a lot of discovery during my coding. Using React and JSX to create the interface and creating the pure typescript functions (such as traversing the DAG) was the most straightforward process, but adding interactivity to the interface was slightly more challenging. React state can be very tricky (infinite loops, stale state) since there is more going on under the hood than what the user is coding. Utilizing typescript was difficult at times, since some of the language features didn't feel compatible with it. This struggle is most evident at the mappings interface declared in `prefillbox.tsx`, where I had to make the fields optional to allow some code to run.

### Code Structure Improvements
With what I have learned, there are a few changes that I would make immediately when refactoring the code. First, I would create dedicated interfaces or classes for transmitting data between the PrefillBox and its subcomponents. This would create more clarity in the code instead of a string or a node. Next, I would create more infrastructure for the interfaces created: constructors or other utility functions to ensure that new data could be easily created for testing. Finally, I would create a system above the PrefillBox to handle data sources in a more straightforward manner.

### Testing
All testing was manually done since I was unfamiliar with any testing libraries. This is an area that will need improvement in the next React project I do, since any large software project needs extensive testing.
