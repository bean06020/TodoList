const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.querySelector('#taskList');

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
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = document.createElement('div');
    newTask.className = 'task-item bg-white border border-gray-200 rounded-lg p-4 shadow-sm';

    const now = new Date();
    const timeString = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');

    newTask.innerHTML = `
        <div class="flex items-center">
            <input type="checkbox" class="checkbox w-4 h-4 rounded-full border-2 border-gray-300 mr-3">
            <span class="text-sm">${taskText}</span>
            <div class="ml-auto flex items-center space-x-2">
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${timeString}</span>
                <button class="text-gray-400 hover:text-gray-600">...</button>
            </div>
        </div>
    `;
    


    taskList.prepend(newTask);
    taskInput.value = '';

    const newCheckbox = newTask.querySelector('.checkbox');
    bindCheckboxToggle(newCheckbox);
}

// ✅ 點擊按鈕可新增
addButton.addEventListener('click', addTask);

// ✅ 按下 Enter 也可以新增
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
