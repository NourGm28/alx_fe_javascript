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
    // Initialize quotes array with default data or from local storage
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" }
    ];

    // Function to save quotes to local storage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Function to display a random quote
    function showRandomQuote() {
        let quoteDisplay = document.getElementById("quoteDisplay");
        let randomIndex = Math.floor(Math.random() * quotes.length);
        let randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
    }

    // Function to add a new quote
    function addQuote() {
        let newQuoteText = document.getElementById("newQuoteText").value.trim();
        let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (newQuoteText && newQuoteCategory) {
            // Add the new quote to the quotes array and save
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes();
            populateCategories();  // Update category list
            alert("New quote added successfully!");

            // Clear input fields
            document.getElementById("newQuoteText").value = "";
            document.getElementById("newQuoteCategory").value = "";
        } else {
            alert("Please enter both a quote and a category.");
        }
    }

    // Function to populate category dropdown dynamically based on available quotes
    function populateCategories() {
        const categoryDropdown = document.getElementById("categoryDropdown");
        categoryDropdown.innerHTML = ""; // Clear existing options
        let categories =["populateCategories", "categoryFilter", "appendChild", "map"];
        let categories = quotes.map(quote => quote.category)
                               .filter((category, index, self) => self.indexOf(category) === index); // Remove duplicates
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryDropdown.appendChild(option);
        });
    }

    // Function to filter quotes based on selected category
    function filterQuote() {
        const selectedCategory = document.getElementById("categoryDropdown").value;
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        let quoteDisplay = document.getElementById("quoteDisplay");
        if (filteredQuotes.length > 0) {
            let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            let randomQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;
        } else {
            quoteDisplay.innerHTML = "No quotes available for this category.";
        }
    }

    // Function to export quotes to JSON
    function exportQuotes() {
        const dataStr = JSON.stringify(quotes);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "quotes.json";
        downloadLink.click();
        URL.revokeObjectURL(url);
    }

    // Function to import quotes from JSON
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories(); // Update categories after import
            alert("Quotes imported successfully!");
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Event listeners
    document.getElementById("newQuote").addEventListener('click', showRandomQuote);
    document.querySelector("button[onclick='addQuote()']").addEventListener('click', addQuote);
    document.getElementById("categoryDropdown").addEventListener('change', filterQuote);
    document.getElementById("exportBtn").addEventListener('click', exportQuotes);
    document.getElementById("importFile").addEventListener('change', importFromJsonFile);

    // Initialize categories and show a random quote
    populateCategories();
    showRandomQuote();
});




