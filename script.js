
let tasks = [];


window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateProgress();
    updateTimeDistribution();
});
document.getElementById('addTaskBtn').addEventListener('click', addTask);


document.getElementById('subjectInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

document.getElementById('hoursInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});


function addTask() {
    const subjectInput = document.getElementById('subjectInput');
    const hoursInput = document.getElementById('hoursInput');
    
    const subject = subjectInput.value.trim();
    const hours = parseFloat(hoursInput.value);
    
    
    if (subject === '') {
        alert('Please enter a subject name!');
        return;
    }
    
    if (isNaN(hours) || hours <= 0) {
        alert('Please enter valid study hours!');
        return;
    }
    
    
    const task = {
        id: Date.now(),
        subject: subject,
        hours: hours,
        completed: false
    };
    
   
    tasks.push(task);
    
   
    saveTasks();
    
    
    subjectInput.value = '';
    hoursInput.value = '';
    
    
    renderTasks();
    updateProgress();
    updateTimeDistribution();
    
   
    subjectInput.focus();
}

// Render all tasks
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <p>No study tasks yet. Add your first task above! 📝</p>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskItem.innerHTML = `
            <input type="checkbox" 
                   class="task-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <div class="task-details">
                <div class="task-subject">${task.subject}</div>
                <div class="task-hours">⏱️ ${task.hours} ${task.hours === 1 ? 'hour' : 'hours'}</div>
            </div>
            <button class="task-delete" onclick="deleteTask(${task.id})">Delete</button>
        `;
        
        tasksList.appendChild(taskItem);
    });
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateProgress();
    }
}

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateProgress();
        updateTimeDistribution();
    }
}

// Update progress statistics
function updateProgress() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update stats
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    document.getElementById('completionRate').textContent = completionRate + '%';
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = completionRate + '%';
    
    // Update motivational message
    updateMotivationalMessage(completionRate, totalTasks);
}

// Update motivational message based on completion rate
function updateMotivationalMessage(rate, totalTasks) {
    const messageDiv = document.getElementById('motivationalMessage');
    
    if (totalTasks === 0) {
        messageDiv.textContent = '';
        messageDiv.className = 'motivational-message';
        return;
    }
    
    if (rate === 100) {
        messageDiv.textContent = '🎉 Amazing! You are doing great! All tasks completed! 🌟';
        messageDiv.className = 'motivational-message success';
    } else if (rate >= 75) {
        messageDiv.textContent = '💪 Great progress! You\'re almost there! Keep it up!';
        messageDiv.className = 'motivational-message encourage';
    } else if (rate >= 50) {
        messageDiv.textContent = '👍 Good work! You\'re halfway there! Don\'t give up!';
        messageDiv.className = 'motivational-message encourage';
    } else if (rate >= 25) {
        messageDiv.textContent = '🚀 Keep going! Every task completed is a step forward!';
        messageDiv.className = 'motivational-message encourage';
    } else if (rate > 0) {
        messageDiv.textContent = '💡 You\'ve started! That\'s the hardest part. Keep pushing!';
        messageDiv.className = 'motivational-message encourage';
    } else {
        messageDiv.textContent = '📚 Time to start! Check off your first task and build momentum!';
        messageDiv.className = 'motivational-message encourage';
    }
}

// Update time distribution chart
function updateTimeDistribution() {
    const timeDistDiv = document.getElementById('timeDistribution');
    
    if (tasks.length === 0) {
        timeDistDiv.innerHTML = `
            <div class="empty-state">
                <p>Add tasks to see time distribution by subject</p>
            </div>
        `;
        return;
    }
    
    // Calculate total hours
    const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
    
    // Group tasks by subject
    const subjectHours = {};
    tasks.forEach(task => {
        if (subjectHours[task.subject]) {
            subjectHours[task.subject] += task.hours;
        } else {
            subjectHours[task.subject] = task.hours;
        }
    });
    
    // Clear and rebuild
    timeDistDiv.innerHTML = '';
    
    // Create bars for each subject
    Object.keys(subjectHours).forEach(subject => {
        const hours = subjectHours[subject];
        const percentage = (hours / totalHours) * 100;
        
        const subjectBar = document.createElement('div');
        subjectBar.className = 'subject-bar';
        
        subjectBar.innerHTML = `
            <div class="subject-name">${subject}</div>
            <div class="bar-container">
                <div class="bar-fill" style="width: ${percentage}%">
                    ${hours.toFixed(1)}h (${percentage.toFixed(0)}%)
                </div>
            </div>
        `;
        
        timeDistDiv.appendChild(subjectBar);
    });
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('studyPlannerTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('studyPlannerTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

}
