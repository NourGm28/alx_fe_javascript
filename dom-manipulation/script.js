// document.addEventListener('DOMContentLoaded', function() {
//     let btn = document.getElementById("newQuote");
//     const url = "https://api.quotable.io/random";
//     function showRandomQuote(){
//         let quote = document.getElementById("quoteDisplay");
//         let requestQoute = fetch(url);
//         let respond = requestQoute.json();
//         console.log(respond);
//         quote.innerHTML = respond.textContent;
        
//     }
//     let addBtn = document.getElementsByTagName("button");
//     btn.addEventListener('click', showRandomQuote);
//     function addQuote(){
//         let newQuote = document.getElementById("newQuoteText").value;
//         let newQuoteCategory = document.getElementById("newQuoteCategory").value;
//         let add = newQuote.jsonStringify({
//             method: "POST",
//             "content": newQuote,
//             "category": newQuoteCategory,
//         });
//     }
//     });

document.addEventListener('DOMContentLoaded', function () {
    // Array to store quotes and categories
    let quotes = [
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];

    // Function to display a random quote
    function createAddQuoteForm() {
        let quoteDisplay = document.getElementById("quoteDisplay");
        let randomIndex = Math.floor(Math.random() * quotes.length); // Select random quote
        let randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
    }

    // Attach event listener to 'Show New Quote' button
    let showQuoteBtn = document.getElementById("newQuote");
    showQuoteBtn.addEventListener('click', createAddQuoteForm);

    // Function to add a new quote
    function addQuote() {
        let newQuoteText = document.getElementById("newQuoteText").value.trim();
        let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (newQuoteText !== "" && newQuoteCategory !== "") {
            // Add the new quote to the quotes array
            quotes.push({ text: newQuoteText, category: newQuoteCategory });

            // Clear the input fields
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
            document.createElement("div");
            quoteDisplay.appendChild(quoteDisplay);
            alert("New quote added successfully!");
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    // Attach event listener to 'Add Quote' button
    let addQuoteBtn = document.querySelector("button[onclick='addQuote()']");
    addQuoteBtn.addEventListener('click', addQuote);

    // Optionally, show a random quote when the page loads
    createAddQuoteForm();
});





