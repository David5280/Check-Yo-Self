var toDoStorage = JSON.parse(localStorage.getItem('list')) || [];
var taskItems = [];
var searchInput = document.querySelector('#header-search-input')
var taskTitle = document.querySelector('#task-title-input');
var taskBody = document.querySelector('#task-item-input');
var taskSubmitBtn = document.querySelector('.menu-submit-btn');
var submitTaskBtn = document.querySelector('#submit-task')
var taskItemPreview = document.querySelector('#menu-task-item-staging');
var clearAllBtn = document.querySelector('#menu-clear-all-btn');
var urgencyFilterBtn = document.querySelector('#menu-urgency-button');
var menuForm = document.querySelector('#menu-form');
 












menuForm.addEventListener('click', function(e) {
    if (e.target.className === 'menu-submit-btn') {
      e.preventDefault();
      var taskObj = {task: taskBody.value, id: Date.now()};
      taskItems.push(taskObj);
      populatePreview(taskObj);
      checkStagingArea();
    }
  });
  taskTitle.addEventListener('keyup', checkStagingArea);
  taskBody.addEventListener('keyup', checkStagingArea);
  




















  function populatePreview(taskObj) {
  var tasks = taskItems.map(a => a.task);
  console.log(tasks);
  for (var i=0; i < tasks.length; i++) {
    taskItemPreview.innerText = tasks;
  }
  // taskItemPreview.innerHTML = `<ul>${tasks}</ul><br />`;
}

function checkStagingArea() {
	if (taskItems.length > 0) {
    submitTaskBtn.disabled = false;
    submitTaskBtn.classList.add('enable');
	} else {
    submitTaskBtn.disabled = true;
    submitTaskBtn.classList.remove('enable');
	};
};

function saveTask(e) {
  event.preventDefault();
  var task = new Task(taskTitle.value, taskBody.value, Date.now());
  toDoStorage.push(task);
  task.saveToStorage(toDoStorage);
};

// function genCard(newTask, urgency) {
// 	var ideaCard = `
// 		<article class = 'task-card' data-id='${newtask.id}'>
//             <div class = '-card-top'>
//             </div>
//             <article>
//                 <h3 class = 'task-card-title' contenteditable = 'true'>${newtask.title}</h4>
//                 <p class = 'task-card-text' contenteditable = 'true'>${newtask.body}</p>
//             </article>
//             <div class = 'task-card-bottom'>
//                 <input type = 'image' src = 'Images/upvote.svg' class = 'upvote-deact'>
//                 <p class = 'quality'>Quality:</p>
//                 <input type = 'image' src = 'Images/downvote.svg' class = 'downvote-deact'>
//             </div>
//         </article>
//           `
//           storageBox.insertAdjacentHTML('afterBegin', taskCard);
 