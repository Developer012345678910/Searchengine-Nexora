/* Fetch the crawled data and store it in db1 */
let db1 = {};
const searchInput = document.getElementById("search-input"); 
const resultsContainer = document.getElementById("results-container");

fetch("crawled_data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Validate data format
    if (!data || (typeof data !== 'object')) {
      throw new Error("Invalid data format: expected object or array");
    }
    db1 = data;
    console.log("Loaded data:", db1);

    // Perform initial search
    search("");
    
    // Add event listener for real-time search
    searchInput.addEventListener("input", () => {
      search(searchInput.value.trim());
    });
  })
  .catch(error => {
    console.error("Error loading crawled_data.json:", error);
    const errorMsg = document.createElement("p");
    errorMsg.style.color = "red";
    errorMsg.textContent = "Error loading search data. Please check if crawled_data.json exists or is valid JSON.";
    resultsContainer.appendChild(errorMsg);
  });

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Search function that filters websites by keyword
 * Works with new data format: { name: {...}, ... }
 */
function search(keyword) {
    resultsContainer.innerHTML = ""; // Clear previous results

    // Convert db1 object values to array if needed
    const websites = Array.isArray(db1) ? db1 : Object.values(db1);

    if (websites.length === 0) {
        resultsContainer.innerHTML = "<p>No websites found. Run the crawler first.</p>";
        return;
    }

    let resultCount = 0;

    for (const website of websites) {
        // Support both old format [name, title] and new format {name, title, ...}
        const name = Array.isArray(website) ? website[0] : website.name || "";
        const title = Array.isArray(website) ? website[1] : website.title || "";

        // Skip if keyword doesn't match
        if (keyword && !name.toLowerCase().includes(keyword.toLowerCase()) && 
            !title.toLowerCase().includes(keyword.toLowerCase())) {
            continue;
        }

        resultCount++;
        const card = document.createElement("div");
        card.classList.add("card");

        // Display metadata if available
        let metadata = "";
        if (!Array.isArray(website) && website.last_crawled) {
            const crawlDate = new Date(website.last_crawled).toLocaleDateString();
            metadata = `<small>Last updated: ${crawlDate}</small>`;
        }

        // Build URL with protocol detection or default to https
        const url = name.startsWith("http://") || name.startsWith("https://") 
            ? name 
            : `https://${name}`;

        // Use textContent and createElement to safely build the card
        const linkElement = document.createElement("a");
        linkElement.href = url;
        linkElement.target = "_blank";
        linkElement.className = "website-link";
        linkElement.textContent = escapeHTML(name);

        const titleElement = document.createElement("span");
        titleElement.className = "website-title";
        titleElement.textContent = escapeHTML(title);

        card.appendChild(linkElement);
        card.appendChild(document.createElement("br"));
        card.appendChild(titleElement);
        
        if (metadata) {
            card.appendChild(document.createElement("br"));
            const metaElement = document.createElement("small");
            metaElement.textContent = `Last updated: ${new Date(website.last_crawled).toLocaleDateString()}`;
            card.appendChild(metaElement);
        }

        resultsContainer.appendChild(card);
    }

    // Show message if no results found
    if (resultCount === 0 && keyword) {
        const noResultsMsg = document.createElement("p");
        noResultsMsg.innerHTML = `No results found for "<strong>${escapeHTML(keyword)}</strong>"`;
        resultsContainer.appendChild(noResultsMsg);
    } else if (resultCount === 0) {
        resultsContainer.innerHTML = "<p>No websites available.</p>";
    }
}



