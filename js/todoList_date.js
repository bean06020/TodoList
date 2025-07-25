
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份是從0開始的，所以要+1
const day = String(today.getDate()).padStart(2, '0');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekday = weekdays[today.getDay()]; // 取得星期幾
const formattedDate = `${year}-${month}-${day}, ${weekday} `;

document.getElementById("today-date").textContent = formattedDate;

