
document.addEventListener("DOMContentLoaded", function () {

  loadSavedName();       
  fetchLiveQuote();      
  addSearchBar();        
  addDarkModeButton();   
  addBookListButton();   

});


function loadSavedName() {

  var savedName = localStorage.getItem("username");

  if (!savedName) {
    var name = prompt("Welcome! What is your name?");
    if (name) {
      localStorage.setItem("username", name);
      showWelcome(name);
    }
  } else {
    showWelcome(savedName);
  }
}

function showWelcome(name) {
  var greeting = document.createElement("p");
  greeting.textContent = "👋 Hello, " + name + "! Happy Reading.";
  greeting.style.cssText = "text-align:center; font-weight:600; color:#02598b; font-size:1rem; margin-bottom:10px;";
  var goals = document.querySelector(".goals-grid");
  goals.insertAdjacentElement("beforebegin", greeting);
}


function fetchLiveQuote() {


  var quoteBox = document.createElement("div");
  quoteBox.id = "quoteBox";
  quoteBox.style.cssText = `
    background: linear-gradient(135deg, #e8f4fb, #d0e9f7);
    border-left: 5px solid #02598b;
    border-radius: 10px;
    padding: 18px 22px;
    margin: 0 0 30px 0;
    font-size: 15px;
    color: #333;
    font-style: italic;
  `;
  quoteBox.innerHTML = "<p>⏳ Loading a reading quote for you...</p>";


  var banner = document.querySelector(".welcome-banner");
  banner.insertAdjacentElement("afterend", quoteBox);

  fetch("https://api.quotable.io/random?tags=education|knowledge|books")
    .then(function (response) {
      return response.json();    
    })
    .then(function (data) {
      quoteBox.innerHTML = `
        <p style="margin:0 0 8px;">"${data.content}"</p>
        <p style="margin:0; font-weight:700; font-style:normal; color:#02598b;">
          — ${data.author}
        </p>`;
    })
    .catch(function () {
      quoteBox.innerHTML = `
        <p style="margin:0 0 8px;">"A reader lives a thousand lives before he dies."</p>
        <p style="margin:0; font-weight:700; font-style:normal; color:#02598b;">— George R.R. Martin</p>`;
    });
}



function addSearchBar() {

  var bar = document.createElement("div");
  bar.style.cssText = "text-align:center; margin: 20px 0;";
  bar.innerHTML = `
    <input  id="bookInput" type="text" placeholder="Search any book..."
            style="padding:10px; width:260px; border-radius:8px;
                   border:2px solid #02598b; font-size:15px;" />
    <button id="searchBtn"
            style="padding:10px 20px; background:#02598b; color:white;
                   border:none; border-radius:8px; font-size:15px;
                   cursor:pointer; margin-left:8px;">
      Search 🔍
    </button>
    <div id="results" style="margin-top:20px;"></div>`;

  var banner = document.querySelector(".welcome-banner");
  banner.insertAdjacentElement("afterend", bar);

  document.getElementById("searchBtn").addEventListener("click", searchBooks);

  
  document.getElementById("bookInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") searchBooks();
  });
}

function searchBooks() {

  var query = document.getElementById("bookInput").value.trim();

  if (query === "") {
    alert("Please type a book name first!");
    return;
  }

  document.getElementById("results").innerHTML = "<p>⏳ Searching Open Library...</p>";

  var url = "https://openlibrary.org/search.json?q=" + encodeURIComponent(query) + "&limit=5";

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showResults(data.docs);
    })
    .catch(function (error) {
      document.getElementById("results").innerHTML =
        "<p style='color:red;'>❌ Error: " + error.message + ". Check your internet connection.</p>";
    });
}

function showResults(books) {

  var resultsDiv = document.getElementById("results");

  if (!books || books.length === 0) {
    resultsDiv.innerHTML = "<p>No books found. Try a different search term.</p>";
    return;
  }

  var html = "<h3 style='color:#02598b;'>📚 Search Results:</h3><ul style='list-style:none; padding:0;'>";

  for (var i = 0; i < books.length; i++) {
    var title  = books[i].title || "Unknown Title";
    var author = books[i].author_name ? books[i].author_name[0] : "Unknown Author";
    var year   = books[i].first_publish_year || "—";
    var link   = "https://openlibrary.org" + books[i].key;

    html += `<li style="margin:10px 0; padding:12px; background:#f0f7ff; border-radius:8px; text-align:left;">
               📖 <strong>${title}</strong> by ${author} (${year})
               &nbsp;<a href="${link}" target="_blank" style="color:#02598b;">Read →</a>
             </li>`;
  }

  html += "</ul>";
  resultsDiv.innerHTML = html;
}



function addDarkModeButton() {

  var btn = document.createElement("button");
  btn.id = "darkModeBtn";
  btn.textContent = "🌙 Dark Mode";
  btn.style.cssText = `
    position: fixed; top: 18px; right: 20px; z-index: 9999;
    padding: 10px 18px; background: #02598b; color: white;
    border: none; border-radius: 8px; font-size: 14px;
    font-weight: 600; cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);`;
  document.body.appendChild(btn);

 
  if (localStorage.getItem("darkMode") === "dark") {
    document.body.classList.add("dark-mode");
    btn.textContent = "☀️ Light Mode";
  }

  btn.addEventListener("click", function () {
    var isDark = document.body.classList.contains("dark-mode");
    if (isDark) {
      document.body.classList.remove("dark-mode");
      btn.textContent = "🌙 Dark Mode";
      localStorage.setItem("darkMode", "light");
    } else {
      document.body.classList.add("dark-mode");
      btn.textContent = "☀️ Light Mode";
      localStorage.setItem("darkMode", "dark");
    }
  });
}



function addBookListButton() {

  var btn = document.createElement("button");
  btn.id = "bookListBtn";
  btn.textContent = "📋 My Book List";
  btn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    padding: 12px 20px; background: #02598b; color: white;
    border: none; border-radius: 10px; font-size: 14px;
    font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,0.25); font-family: inherit;`;
  document.body.appendChild(btn);

 
  var panel = document.createElement("div");
  panel.id = "bookListPanel";
  panel.style.cssText = `
    display: none; position: fixed; bottom: 80px; right: 24px;
    z-index: 9998; background: white; border: 2px solid #02598b;
    border-radius: 12px; padding: 20px; width: 280px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2); font-family: inherit;`;
  document.body.appendChild(panel);

  btn.addEventListener("click", function () {
    if (panel.style.display === "none") {
      renderBookList(panel);
      panel.style.display = "block";
    } else {
      panel.style.display = "none";
    }
  });

  
  document.querySelectorAll(".book-card").forEach(function (card, index) {
    var img   = card.querySelector("img");
    var title = (img && img.alt) ? img.alt : "Book " + (index + 1);
    var link  = card.querySelector("a") ? card.querySelector("a").href : "#";

    var addBtn = document.createElement("button");
    addBtn.textContent = "+ Add to List";
    addBtn.style.cssText = `
      display:block; width:100%; margin-top:6px; padding:7px 0;
      background:#f0f7ff; color:#02598b; border:2px solid #02598b;
      border-radius:5px; font-size:13px; font-weight:700;
      cursor:pointer; font-family:inherit;`;

    addBtn.addEventListener("click", function () {
      var list = JSON.parse(localStorage.getItem("bookList") || "[]");
      var exists = list.some(function (b) { return b.title === title; });
      if (!exists) {
        list.push({ title: title, link: link });
        localStorage.setItem("bookList", JSON.stringify(list));
        addBtn.textContent = "✅ Added!";
        addBtn.style.background = "#e6f9ee";
        addBtn.style.color = "#27ae60";
        addBtn.style.borderColor = "#27ae60";
      } else {
        alert("⚠️ Already in your list!");
      }
    });

    card.appendChild(addBtn);
  });
}

function renderBookList(panel) {
  var list = JSON.parse(localStorage.getItem("bookList") || "[]");
  var html = `<h3 style="margin:0 0 12px; color:#02598b; font-size:1rem;">📋 My Book List</h3>`;

  if (list.length === 0) {
    html += `<p style="color:#888; font-size:13px;">No books added yet.<br/>Click "+ Add to List" on any book!</p>`;
  } else {
    html += `<ul style="list-style:none; padding:0; margin:0;">`;
    list.forEach(function (book) {
      html += `<li style="padding:8px 0; border-bottom:1px solid #eee; font-size:13px;">
                 📖 <a href="${book.link}" target="_blank"
                       style="color:#02598b; text-decoration:none; font-weight:600;">
                   ${book.title}
                 </a>
               </li>`;
    });
    html += `</ul>
      <button onclick="clearBookList()" style="
        margin-top:14px; width:100%; padding:8px;
        background:#ffe4e4; color:#e74c3c;
        border:2px solid #e74c3c; border-radius:8px;
        font-size:13px; font-weight:700; cursor:pointer;">
        🗑️ Clear List
      </button>`;
  }
  panel.innerHTML = html;
}

function clearBookList() {
  if (confirm("Clear your entire Book List?")) {
    localStorage.removeItem("bookList");
    renderBookList(document.getElementById("bookListPanel"));
    document.querySelectorAll(".book-card button").forEach(function (btn) {
      if (btn.textContent === "✅ Added!") {
        btn.textContent = "+ Add to List";
        btn.style.background  = "#f0f7ff";
        btn.style.color       = "#02598b";
        btn.style.borderColor = "#02598b";
      }
    });
  }
}
