// IIFE
(() => {
    // Local Storage
    const localStorage = window.localStorage;
    localStorage.setItem('limit','5');
    // localStorage.skip('limit','5')

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

        static async find(query){
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
    const DOMstrings = {
        newQueue: 'new-queue',
        toggleDisabled: 'toggle-disabled',
        codeHeader: 'code-header',
        dataBody: 'data-body',
    };

    // Select DOM elements
    const DOMElements = {
        newQueueBtn: document.getElementById(DOMstrings.newQueue),
        toggleDisabledBtn: document.getElementById(DOMstrings.toggleDisabled),
        codeHeader: document.getElementById(DOMstrings.codeHeader),
        dataBody: document.querySelector(`.${DOMstrings.dataBody}`)
    };



    // Templates
    const DOMTemplates = {
        queue: (queue) => {
            return `<div class="data-row">
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


    DOMElements.codeHeader.addEventListener('click', async( e ) => {
        console.log( e.target.parentNode )

        // Build the filter
        // const filter = {
        //     sort: 'code'
        // };  

        // Get the data from the Queue model
        const data = await Queue.find(`?sort=code&limit=5`);

        // Clean data-body div
        DOMElements.dataBody.innerHTML = '';

        // Render the queues
        data.queues.forEach( queue => {
            DOMElements.dataBody.insertAdjacentHTML('beforeend', DOMTemplates.queue(queue));
        })
    });
})()
