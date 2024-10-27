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
    const serverURL = "https://jsonplaceholder.typicode.com/posts"; // Replace with actual endpoint in real-world cases

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
            const newQuote = { text: newQuoteText, category: newQuoteCategory };
            quotes.push(newQuote);
            saveQuotes();
            syncWithServer(newQuote, 'POST'); // Sync new quote with server
            populateCategories(); // Update categories
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
    function categoryFilter() {
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

    // Function to sync with server, using a POST request for new quotes
    async function syncWithServer(data, method) {
        try {
            const response = await fetch(serverURL, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                console.log("Sync with server successful.");
            } else {
                console.warn("Failed to sync with server.");
            }
        } catch (error) {
            console.error("Error syncing with server:", error);
        }
    }

    // Periodic sync with server to update quotes from server
    async function periodicSync() {
        try {
            const response = await fetch(serverURL);
            if (response.ok) {
                const serverQuotes = await response.json();
                handleServerData(serverQuotes); // Resolve conflicts and update quotes
            } else {
                console.warn("Failed to fetch data from server.");
            }
        } catch (error) {
            console.error("Error fetching data from server:", error);
        }
    }

    // Handle server data and resolve conflicts
    function handleServerData(serverQuotes) {
        serverQuotes.forEach(serverQuote => {
            const localQuote = quotes.find(quote => quote.text === serverQuote.text);
            if (!localQuote) {
                quotes.push(serverQuote); // Add new quote from server
            } else if (JSON.stringify(localQuote) !== JSON.stringify(serverQuote)) {
                alert(`Conflict detected for quote: "${serverQuote.text}". Server data has been updated.`);
                localQuote.category = serverQuote.category; // Update local quote with server's category
            }
        });
        saveQuotes(); // Save updated quotes to local storage
        populateCategories(); // Refresh categories in dropdown
    }

    // Set up periodic server check every 30 seconds
    setInterval(periodicSync, 30000);

    // Event listeners
    document.getElementById("newQuote").addEventListener('click', showRandomQuote);
    document.querySelector("button[onclick='addQuote()']").addEventListener('click', addQuote);
    document.getElementById("categoryDropdown").addEventListener('change', categoryFilter);
    document.getElementById("exportBtn").addEventListener('click', exportQuotes);
    document.getElementById("importFile").addEventListener('change', importFromJsonFile);

    // Initialize categories and show a random quote
    populateCategories();
    showRandomQuote();
});
