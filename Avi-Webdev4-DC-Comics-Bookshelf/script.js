// script.js

// Function to call the deployed Cloud Function with a search query
async function searchComic(query) {
  try {
    const response = await fetch("https://us-central1-dc-comics-bookshelf.cloudfunctions.net/searchComics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch comic data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching for comics:", error);
    return null;
  }
}

// Function to render results into the #bookshelf grid
function renderResults(results) {
  const container = document.getElementById("bookshelf");
  container.innerHTML = ""; // Clear previous

  if (!results || results.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach(comic => {
    const card = document.createElement("div");
    card.className = "book";
    card.innerHTML = `
      <img src="${comic.image}" alt="${comic.title}" />
      <h3>${comic.title}</h3>
      <p>${comic.description || "No description available."}</p>
    `;
    container.appendChild(card);
  });
}

// Event listener for search bar
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchBar");

  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        const results = await searchComic(query);
        renderResults(results);
      }
    }
  });
});
