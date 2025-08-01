const quotes = [ 
  { text: "Life will find a way.", author: "Jurassic Park" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "F. D. Roosevelt" },
  { text: "成功是跌倒九次後，仍能站起來十次。", author: "Unknown" }
  { text: "No cross, no crown. ", author: "Unknown" }
  { text: "Spend your life in your own way.", author: "Unknown" }
  { text: "There are so many beautiful reasons to be happy.", author: "Unknown" }

];

// 取得 localStorage 的上一個索引值
let lastIndex = localStorage.getItem("lastQuoteIndex");
lastIndex = lastIndex !== null ? Number(lastIndex) : -1;

function showRandomQuote() {
  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * quotes.length);
  } while (randomIndex === lastIndex && quotes.length > 1); // 至少兩句話才要檢查重複

  const quote = quotes[randomIndex];

  // 顯示名言
  document.getElementById("quote-text").textContent = `"${quote.text}"`;
  document.getElementById("quote-author").textContent = `— ${quote.author}`;

  // 更新 localStorage
  localStorage.setItem("lastQuoteIndex", randomIndex);
}

// 載入頁面時執行
showRandomQuote();
