const API_KEY = "12a10514a29ee249fdcde1c533ac7347c4833727";
let lastSearchQuery = "";
let offset = 0;
let currentResults = [];

function renderBooks(books) {
  const shelf = document.getElementById("bookshelf");
  shelf.innerHTML = "";

  // Add Book Button
  const addCard = document.createElement("div");
  addCard.className = "add-book-card";
  addCard.textContent = "+";
  addCard.onclick = () => {
    document.getElementById("addBookPanel").classList.remove("hidden");
  };
  shelf.appendChild(addCard);

  // Add each book
  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "comic-card";

    const img = document.createElement("img");
    img.src = book.image;
    img.alt = book.title;

    const title = document.createElement("h3");
    title.textContent = book.title;

    card.appendChild(img);
    card.appendChild(title);
    shelf.appendChild(card);
  });
}

// Dummy initial bookshelf
const myBooks = [
  { title: "Batman: Year One", image: "https://static.comicvine.com/uploads/scale_small/0/40/198606-19249-batman-year-one.jpg" },
  { title: "Wonder Woman: Rebirth", image: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/5395397-01.jpg" }
];

renderBooks(myBooks);

async function searchComics(query, append = false) {
  try {
    const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
    const fullUrl = `https://comicvine.gamespot.com/api/search/?api_key=${API_KEY}&format=json&resources=issue&query=${query}&limit=7&offset=${offset}`;
    const response = await fetch(proxyUrl + encodeURIComponent(fullUrl));
    const data = await response.json();
    const parsed = JSON.parse(data.contents);

    if (!append) currentResults = [];

    const results = parsed.results.map(result => {
      const title = result.name || result.volume?.name || result.volume?.api_detail_url || "Untitled";
      let image = result.image?.original_url || result.image?.small_url || result.volume?.image?.small_url;
      if (!image || image === "null") {
        image = "https://via.placeholder.com/150";
      }
      return { title, image };
    });

    currentResults = [...currentResults, ...results];

    const searchResults = document.getElementById("searchResults");
    results.forEach(book => {
      const div = document.createElement("div");
      div.className = "search-result";

      const img = document.createElement("img");
      img.src = book.image;
      img.alt = book.title;

      const span = document.createElement("span");
      span.textContent = book.title;

      div.appendChild(img);
      div.appendChild(span);

      div.onclick = () => {
        myBooks.push(book);
        renderBooks(myBooks);
        document.getElementById("addBookPanel").classList.add("hidden");
      };

      searchResults.appendChild(div);
    });

    // Show More Button
    if (parsed.number_of_total_results > currentResults.length) {
      const showMore = document.createElement("div");
      showMore.className = "show-more";
      showMore.textContent = "Show more...";
      showMore.onclick = () => {
        offset += 7;
        searchComics(lastSearchQuery, true);
      };
      searchResults.appendChild(showMore);
    }

  } catch (err) {
    console.error("Search error:", err);
  }
}

document.getElementById("addBookSearchBtn").addEventListener("click", () => {
  const query = document.getElementById("addBookSearch").value.trim();
  if (query.length < 1) return;

  // Clear old results
  document.getElementById("searchResults").innerHTML = "";

  // Update global search reference
  lastSearchQuery = query;
  offset = 0;

  // Trigger new search
  searchComics(query);
});
