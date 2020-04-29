// IIFE
(() => {

    
    
    // Declare endpoints
    const endpoints = {
        queues: 'http://localhost:3000/queues.json'
    };
    
    // CONFIG
    // *******************
    const SERVER = 'http://localhost:3000';
    const ROUTES = {
        queues: '/queues.json'
    };
    
    
    // MODELS
    // *******************
    class Queue {
        constructor(code, name){
            this.code = code;
            this.name = name;
        };
        
        static async find( query ){
            const path = `${ROUTES.queues}${query}`;
            const request = new Request( SERVER + path, { method: 'GET' });
            
            try{
                const response = await fetch(request);
                const data = await response.json();
                return data;
                
            } catch(e){
                console.log( e );
            };
        };
    };
    
    // VIEWS
    // *******************
    
    // Declare DOM strings
    const DOMStrings = {
        newQueue: 'new-queue',
        toggleDisabled: 'toggle-disabled',
        dataHeader: 'data-header',
        dataBody: 'data-body',
    };
    
    // Select DOM elements
    const DOMElements = {
        newQueueBtn: document.getElementById(DOMStrings.newQueue),
        toggleDisabledBtn: document.getElementById(DOMStrings.toggleDisabled),
        dataHeader: document.querySelector( `.${DOMStrings.dataHeader}` ),
        dataBody: document.querySelector(`.${DOMStrings.dataBody}`)
    };
    
    
    // Templates
    const DOMTemplates = {
        queue: queue => {
            return `
            <div class="data-row">
                <div>
                    <span class="code">${queue.code}</span>
                </div>
                <div>
                    <p>${queue.name}</p>
                </div>
                <div class="crud-actions">
                    <a href="#">Edit</a>
                    <a href="#">Disable</a>
                    <a href="#">Delete</a>
                </div>
            </div>`
        }
    };
    
    
    // CONTROLLER
    // *******************

    // Controller Globals
    const queuesGlobals = {
        sort: '',
        limit: 5
    };

    // Listen the event in the whole data-header and with event bubbling into it determine which element was clicked
    DOMElements.dataHeader.addEventListener('click', async( event ) => {
        
        // Determine which header element was clicked
        let sort;
        if ( event.target.matches( '#code-header, #code-header *' ) ) {
            sort = 'code';
        } else if ( event.target.matches( '#name-header, #name-header *' ) ){
            sort = 'name';
        } else {
            return; // No sort is being done
        };

        // Update the sort controller variable depending on the previous status
        if( queuesGlobals.sort === sort ){
            sort = sort.startsWith('-') ? sort.replace('-','') : `-${sort}`;
        };

        queuesGlobals.sort = sort;

        // To do: Move the query logic to the model
        const data = await Queue.find(`?sort=${ queuesGlobals.sort }&limit=${ queuesGlobals.limit }`);

        // Clean data-body div
        DOMElements.dataBody.innerHTML = '';

        // Render the queues
        data.queues.forEach( queue => {
            DOMElements.dataBody.insertAdjacentHTML('beforeend', DOMTemplates.queue(queue));
        });
    });
})();
