const apiBase = "https://www.googleapis.com/books/v1/volumes";
const ebooksApiEndpoint = "http://localhost:5000/ebook";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const featuredButton = document.getElementById("featuredButton");
  const freePDFsButton = document.getElementById("freePDFsButton");
  const booksGrid = document.getElementById("booksGrid");
  const ebooksGrid = document.getElementById("ebooksGrid");
  const ebooksSection = document.getElementById("ebooksSection");
  const topFreeDownloadsSection = document.getElementById("topFreeDownloadsSection"); // The section showing "Top Free Downloads"
  const modal = document.getElementById("modal");
  let debounceTimeout;

  loadFeaturedBooks(); // Load featured books on page load

  // Debounced search functionality to avoid multiple fetches
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const query = searchInput.value.trim();
      if (query) {
        // If in Free PDFs section, search in local eBooks API
        if (!ebooksSection.classList.contains("hidden")) {
          searchEbooks(query);
        } else {
          // If in Featured Books section, search in Google Books API
          searchBooks(query);
        }
      }
    }, 300); // Delay search by 300ms after user stops typing
  });

  // Listen for the Enter key in the search input field (trigger the search button)
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default action (form submission if in a form)
      const query = searchInput.value.trim();
      if (query) {
        if (!ebooksSection.classList.contains("hidden")) {
          // If in Free PDFs section, search in local eBooks API
          searchEbooks(query);
        } else {
          // If in Featured Books section, search in Google Books API
          searchBooks(query);
        }
      } else {
        alert("Please enter a search term.");
      }
    }
  });

  // Featured Books Button Functionality
  featuredButton.addEventListener("click", () => {
    ebooksSection.classList.add("hidden");
    booksGrid.parentElement.classList.remove("hidden");
    loadFeaturedBooks();
  });

  // Free PDFs Button Functionality
  freePDFsButton.addEventListener("click", () => {
    ebooksSection.classList.remove("hidden");
    booksGrid.parentElement.classList.add("hidden");
    loadEbooks();
  });

  // Async/await for searching books (Google Books API)
  async function searchBooks(query) {
    booksGrid.innerHTML = "<p>Searching books...</p>"; // Show loading state
    try {
      const response = await fetch(`${apiBase}?q=${encodeURIComponent(query)}&maxResults=15`);
      const data = await response.json();
      displayBooks(data.items);
    } catch (error) {
      console.error("Error during search:", error);
    }
  }

  // Async/await for searching eBooks (local API)
  async function searchEbooks(query) {
    // Clear any existing content in the top free downloads section
    topFreeDownloadsSection.innerHTML = ""; // Remove the "Top Free Downloads" section content

    ebooksGrid.innerHTML = "<p>Searching eBooks...</p>"; // Show loading state
    try {
      const response = await fetch(`${ebooksApiEndpoint}?q=${encodeURIComponent(query)}`);
      const ebooks = await response.json();
      if (ebooks.length === 0) {
        ebooksGrid.innerHTML = "<p>No eBooks found matching your query.</p>";
        return;
      }
      displayEbooks(ebooks);
    } catch (error) {
      console.error("Error during eBook search:", error);
    }
  }

  // Async/await for loading featured books
  async function loadFeaturedBooks() {
    const featuredTopics = [
      "New York Best seller", "economics", "technology", "philosophy", "medicine"
    ];
    const query = featuredTopics.join(" OR ");
    
    booksGrid.innerHTML = "<p>Loading featured books...</p>"; // Show loading state
    try {
      const response = await fetch(`${apiBase}?q=${encodeURIComponent(query)}&maxResults=30`);
      const data = await response.json();
      displayBooks(data.items);
    } catch (error) {
      console.error("Error loading featured books:", error);
    }
  }

  // Async/await for loading eBooks
  async function loadEbooks() {
    ebooksGrid.innerHTML = "<p>Loading eBooks...</p>"; // Show loading state
    try {
      const response = await fetch(ebooksApiEndpoint);
      const ebooks = await response.json();
      if (ebooks.length === 0) {
        ebooksGrid.innerHTML = "<p>No eBooks available at the moment.</p>";
        return;
      }
      displayEbooks(ebooks);
    } catch (error) {
      console.error("Error loading eBooks:", error);
    }
  }

  // Display books with rating (Stars Only)
  function displayBooks(books) {
    booksGrid.innerHTML = ""; // Clear any existing content
    if (!books || books.length === 0) {
      booksGrid.innerHTML = "<p>No books found. Please try another search.</p>";
      return;
    }

    const fragment = document.createDocumentFragment();

    books.forEach((book) => {
      const volumeInfo = book.volumeInfo;
      const title = volumeInfo.title || "Untitled";
      const thumbnail = volumeInfo.imageLinks?.thumbnail || "placeholder.jpg";
      const description = volumeInfo.description || "No description available.";
      const truncatedDescription = description.length > 100 ? description.substring(0, 100) + "..." : description;
      const averageRating = volumeInfo.averageRating || 0;

      const stars = Array.from({ length: 5 }, (_, i) => i < averageRating ? '<span class="star filled">★</span>' : '<span class="star">☆</span>').join("");

      const bookCard = document.createElement("div");
      bookCard.className = "book-card";
      bookCard.innerHTML = `
        <img class="lazy" data-src="${thumbnail}" alt="Cover image of ${title}" />
        <h3>${title}</h3>
        <p class="book-summary">${truncatedDescription}</p>
        <div class="book-rating">${stars}</div>
      `;
      bookCard.addEventListener("click", () => showModal(title, description, volumeInfo.infoLink || "#"));
      fragment.appendChild(bookCard);
    });

    booksGrid.appendChild(fragment); // Update DOM in one go

    // Lazy load images when they come into the viewport
    const lazyImages = document.querySelectorAll(".lazy");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
          entry.target.classList.remove("lazy");
          observer.unobserve(entry.target);
        }
      });
    });
    lazyImages.forEach((image) => observer.observe(image));
  }

  // Display eBooks in the same way as Featured Books (with rating)
  function displayEbooks(ebooks) {
    ebooksGrid.innerHTML = ""; // Clear eBooks grid
    const fragment = document.createDocumentFragment();

    ebooks.forEach((ebook) => {
      const { title, description, downloadLink, coverImage, averageRating } = ebook;
      const truncatedDescription = description.length > 100 ? description.substring(0, 100) + "..." : description;

      const stars = Array.from({ length: 5 }, (_, i) => i < averageRating ? '<span class="star filled">★</span>' : '<span class="star">☆</span>').join("");

      const ebookCard = document.createElement("div");
      ebookCard.className = "book-card";
      ebookCard.innerHTML = `
        <img src="${coverImage || 'placeholder.jpg'}" alt="${title}">
        <h3>${title}</h3>
        <p class="book-summary">${truncatedDescription}</p>
        <div class="book-rating">${stars}</div>
        <a href="${downloadLink}" class="button" download>Download</a>
      `;
      ebookCard.addEventListener("click", () => showModal(title, description, downloadLink));
      fragment.appendChild(ebookCard);
    });

    ebooksGrid.appendChild(fragment);
  }

  // Modal functionality (responsive and summarized description)
  function showModal(title, description, buyLink) {
    const modalTitle = document.getElementById("modalTitle");
    const modalSummary = document.getElementById("modalSummary");
    const buyLinkElement = document.getElementById("buyLink");

    modalTitle.innerText = title;
    modalSummary.innerText = window.innerWidth <= 768 ? description.substring(0, 150) + "..." : description;
    buyLinkElement.href = buyLink;
    modal.classList.add("active");
  }

  // Close Modal
  function closeModal() {
    modal.classList.remove("active");
  }

  document.getElementById("closeModalButton").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
});
