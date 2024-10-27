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
    // Load saved quotes from local storage or use initial quotes
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];

    // Function to display a random quote
    function createAddQuoteForm() {
        let quoteDisplay = document.getElementById("quoteDisplay");
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "No quotes available.";
            return;
        }
        let randomIndex = Math.floor(Math.random() * quotes.length);
        let randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
        sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote)); // Save last viewed quote in session storage
    }

    // Save quotes to local storage
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Function to add a new quote
    function addQuote() {
        let newQuoteText = document.getElementById("newQuoteText").value.trim();
        let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (newQuoteText !== "" && newQuoteCategory !== "") {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes(); // Save the updated quotes array
            document.getElementById("newQuoteText").value = ""; // Clear input fields
            document.getElementById("newQuoteCategory").value = "";
            alert("New quote added successfully!");
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    // Export quotes to JSON file
    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2); // Convert quotes to JSON
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        a.click();

        URL.revokeObjectURL(url); // Clean up
    }

    // Import quotes from JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                quotes.push(...importedQuotes);
                saveQuotes(); // Save imported quotes to local storage
                alert("Quotes imported successfully!");
            } catch (error) {
                alert("Invalid JSON file");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Attach event listeners
    let showQuoteBtn = document.getElementById("newQuote");
    showQuoteBtn.addEventListener('click', createAddQuoteForm);

    let addQuoteBtn = document.querySelector("button[onclick='addQuote()']");
    addQuoteBtn.addEventListener('click', addQuote);

    // Attach export and import event listeners
    document.getElementById("exportButton").addEventListener("click", exportToJsonFile); // Export quotes to JSON
    document.getElementById("importFile").addEventListener("change", importFromJsonFile); // Import quotes from JSON

    // Optionally, show the last viewed quote from session storage on page load
    const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
    if (lastViewedQuote) {
        document.getElementById("quoteDisplay").innerHTML = `"${lastViewedQuote.text}" - Category: ${lastViewedQuote.category}`;
    } else {
        createAddQuoteForm();
    }
});





