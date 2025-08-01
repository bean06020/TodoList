const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.querySelector('#taskList');
const categorySelect = document.getElementById('categorySelect');

// ✅ 勾選 checkbox 時，加上刪除線樣式
function bindCheckboxToggle(checkbox) {
    checkbox.addEventListener('change', function () {
        const taskText = this.nextElementSibling;
        const taskItem = this.closest(".task-item"); // taskItem

        // ✅ 切換已完成樣式
        taskText.classList.toggle('line-through', this.checked);
        taskText.classList.toggle('text-gray-400', this.checked);
        // ✅ 動畫：先加入淡出動畫
        taskItem.classList.add('transition-all', 'duration-300', 'opacity-50');
        setTimeout(() => {
            // ✅ 勾選 -> 移到底部，取消勾選 -> 移到頂部
            if (this.checked) {
                taskItem.parentElement.appendChild(taskItem);
            } else {
                taskItem.parentElement.prepend(taskItem);
            }

            // ✅ 動畫：淡入回原狀
            taskItem.classList.remove('opacity-50');
        }, 200);
    });
}


// ✅ 新增任務主函式
let currentCategory = 'general';  // 預設分類

document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function () {
        currentCategory = this.innerText.trim().toLowerCase();
        filterTasks('category', currentCategory);
    });
});
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = document.createElement('div');
    newTask.className = 'task-item bg-white border border-gray-200 rounded-lg p-4 shadow-sm';
     // 這行加上分類屬性
    newTask.setAttribute('data-category', currentCategory);

    const now = new Date();
    const timeString = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

    newTask.innerHTML = `
        <div class="flex items-center">
            <input type="checkbox" class="checkbox w-4 h-4 rounded-full border-2 border-gray-300 mr-3">
            <span class="text-sm">${taskText}</span>
            <div class="ml-auto flex items-center space-x-2">
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${timeString}</span>
                <button class="delete-btn text-gray-400 hover:text-gray-600">🗑️</button>

            </div>
        </div>
    `;

    taskList.prepend(newTask);
    taskInput.value = '';

    const newCheckbox = newTask.querySelector('.checkbox');
    bindCheckboxToggle(newCheckbox);
}

// ✅ 點擊按鈕、按下 Enter 也可以新增
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
// ✅ 事件代理：點擊垃圾桶刪除任務
taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) {
            taskItem.remove();
        }
    }
});
// ✅ 分類 / 完成 篩選功能
function filterTasks(filterType, category = null) {
    const allTasks = document.querySelectorAll('.task-item');

    allTasks.forEach(task => {
        const taskCategory = task.getAttribute('data-category');
        const checkbox = task.querySelector('input[type="checkbox"]');
        const isCompleted = checkbox.checked;

        let shouldShow = true;

        if (filterType === 'category') {
            shouldShow = taskCategory === category;
        } else if (filterType === 'completed') {
            shouldShow = isCompleted;
        }

        task.style.display = shouldShow ? 'block' : 'none';
    });
}
// ✅ 綁定側邊欄分類按鈕（General / Work / Personal / Study）
document.querySelectorAll('.sidebar-item').forEach(item => {
   item.addEventListener('click', function () {
    // 先移除所有 active 樣式
    document.querySelectorAll('.sidebar-item').forEach(i => {
      i.classList.remove('active');
    });
    // 再加上目前點擊項目 active
    this.classList.add('active');

    const categoryName = this.innerText.trim().toLowerCase();
    filterTasks('category', categoryName);
  });
});

// ✅ 綁定上方的 All / Completed 按鈕
document.querySelectorAll('.flex.space-x-2 button').forEach(btn => {
  btn.classList.add('cursor-pointer');
  btn.addEventListener('click', () => {
    // 移除所有按鈕 active
    document.querySelectorAll('.flex.space-x-2 button').forEach(b => b.classList.remove('active'));

    // 加上目前按鈕 active
    btn.classList.add('active');

    if (btn.textContent === 'All') {
      document.querySelectorAll('.task-item').forEach(task => {
        task.style.display = 'block';
      });
    } else if (btn.textContent === 'Completed') {
      filterTasks('completed');
    }
  });
});
