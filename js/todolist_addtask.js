const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.querySelector('#taskList');

// 增加localStorage功能做資料儲存
let tasks = [];

// 初始化任務資料
document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = localStorage.getItem('taskList');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        // ✅ 這裡先排序，未完成的在前面
        tasks.sort((a, b) => a.completed - b.completed);
        tasks.forEach(task => renderTask(task));
    }
});


// ✅ 新增任務主函式
let currentCategory = 'general';  // 預設分類

// ✅ 綁定側邊欄分類按鈕（General / Work / Personal / Study）
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function () {
        // 移除所有 active 樣式
        document.querySelectorAll('.sidebar-item').forEach(i => {
            i.classList.remove('active');
        });
        // 加上目前點擊項目 active 樣式
        this.classList.add('active');

        // 更新目前分類並篩選
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

    // 增加localStorage功能儲存任務
    const newTaskData = {
        id: Date.now(),
        text: taskText,
        completed: false,
        category: currentCategory,
        time: timeString
    };

    tasks.push(newTaskData);
    localStorage.setItem('taskList', JSON.stringify(tasks));

    renderTask(newTaskData); // 渲染到畫面
    taskInput.value = '';
}

function renderTask(task) {
    const newTask = document.createElement('div');
    newTask.className = 'task-item bg-white border border-gray-200 rounded-lg p-4 shadow-sm';
    newTask.setAttribute('data-category', task.category);
    newTask.setAttribute('data-id', task.id); // 加上 id 用於刪除

    newTask.innerHTML = `
    <div class="flex items-center">
        <input type="checkbox" class="checkbox w-4 h-4 rounded-full border-2 border-gray-300 mr-3" ${task.completed ? 'checked' : ''}>
        <span class="text-sm flex-1 ${task.completed ? 'line-through text-gray-400' : ''}">${task.text}</span>
        <select class="task-category-select border rounded text-xs" style="width: 100px; margin-left: 8px;">
            <option value="general" ${task.category === 'general' ? 'selected' : ''}>General</option>
            <option value="work" ${task.category === 'work' ? 'selected' : ''}>Work</option>
            <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>Personal</option>
            <option value="study" ${task.category === 'study' ? 'selected' : ''}>Study</option>
        </select>
        <div class="ml-2 flex items-center space-x-2">
            <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${task.time}</span>
            <button class="delete-btn text-gray-400 hover:text-gray-600">🗑️</button>
        </div>
    </div>
    `;

    const categorySelector = newTask.querySelector('.task-category-select');
    bindCategorySelector(categorySelector, newTask);

    const newCheckbox = newTask.querySelector('.checkbox');
    bindCheckboxToggle(newCheckbox);

    if (task.completed) {
        taskList.appendChild(newTask); // 加在下面
    } else {
        taskList.prepend(newTask);     // 加在上面
    }

}


// ✅ 點擊按鈕、按下 Enter 也可以新增
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
// ✅ 點擊垃圾桶刪除任務
taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
        const taskItem = e.target.closest('.task-item');
        if (taskItem) {
            const taskId = taskItem.getAttribute('data-id');
            tasks = tasks.filter(task => task.id != taskId); // 移除資料
            localStorage.setItem('taskList', JSON.stringify(tasks));
            taskItem.remove(); // 移除 DOM
        }
    }
});
const deleteModal = document.getElementById("deleteModal");
const clearCompletedBtn = document.querySelector(".clearCompletedBtn");
let tasksToDelete = []; // 用於存所有待刪除的任務元素

clearCompletedBtn.addEventListener("click", () => {
    // 找出所有已完成任務
    tasksToDelete = Array.from(document.querySelectorAll(".task-item")).filter(taskItem => {
        const checkbox = taskItem.querySelector("input[type='checkbox']");
        return checkbox && checkbox.checked;
    });

    if (tasksToDelete.length === 0) {
        alert("沒有已完成的任務可刪除！");
        return;
    }

    deleteModal.classList.remove("hidden");
});

// 取消刪除
document.getElementById("cancelDelete").addEventListener("click", () => {
    tasksToDelete = [];
    deleteModal.classList.add("hidden");
});

// 確定刪除全部已完成任務
document.getElementById("confirmDelete").addEventListener("click", () => {
    if (tasksToDelete.length > 0) {
        const idsToDelete = tasksToDelete.map(taskItem => taskItem.getAttribute('data-id'));
        tasks = tasks.filter(task => !idsToDelete.includes(task.id));
        localStorage.setItem('taskList', JSON.stringify(tasks));

        tasksToDelete.forEach(taskItem => taskItem.remove());
    }
    tasksToDelete = [];
    deleteModal.classList.add("hidden");
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

// ✅ 勾選 checkbox 時，加上刪除線樣式
function bindCheckboxToggle(checkbox) {
    checkbox.addEventListener('change', function () {
        const taskItem = this.closest(".task-item");
        const taskId = taskItem.getAttribute('data-id');
        const taskText = taskItem.querySelector('span');

        taskText.classList.toggle('line-through', this.checked);
        taskText.classList.toggle('text-gray-400', this.checked);

        // 更新資料
        const task = tasks.find(t => t.id == taskId);
        if (task) {
            task.completed = this.checked;
            localStorage.setItem('taskList', JSON.stringify(tasks));
        }

        taskItem.classList.add('transition-all', 'duration-300', 'opacity-50');
        setTimeout(() => {
            if (this.checked) {
                taskItem.parentElement.appendChild(taskItem);
            } else {
                taskItem.parentElement.prepend(taskItem);
            }
            taskItem.classList.remove('opacity-50');
        }, 200);
    });
}


// ✅ 綁定任務的下拉選單，讓分類變更時更新 data-category
function bindCategorySelector(selectElement, taskElement) {
    if (!selectElement) return;  // 避免 null 錯誤
    selectElement.addEventListener('change', function () {
        const newCategory = this.value;
        taskElement.setAttribute('data-category', newCategory);
    });
}


// ✅ 綁定上方的 All / Completed 按鈕
document.querySelectorAll('.category-btn button').forEach(btn => {
    btn.classList.add('cursor-pointer');
    btn.addEventListener('click', () => {
        // 移除所有按鈕 active
        document.querySelectorAll('.category-btn button').forEach(b => b.classList.remove('active'));

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
