var toDoStorage = JSON.parse(localStorage.getItem('list')) || [];
var taskItems = [];
var searchInput = document.querySelector('#header--search')
var taskTitle = document.querySelector('#aside--form--title');
var taskBody = document.querySelector('#aside--form--task');
var taskSubmitBtn = document.querySelector('.aside--form--submit-btn');
var submitTaskBtn = document.querySelector('#aside--form--submit-task')
var taskItemPreview = document.querySelector('#aside--staging');
var clearAllBtn = document.querySelector('#aside--form--clear-btn');
var urgencyFilterBtn = document.querySelector('#aside--urgency-btn');
var menuForm = document.querySelector('#aside-form');
var displayBox = document.querySelector('#main--card-display');
var stagingArea = document.querySelector('.aside--staging');

window.addEventListener('load', retrieveList);

function retrieveList() {
  toDoStorage = toDoStorage.map(function (oldList) {
    var restoredList = new Task(oldList.title, oldList.tasks, oldList.id, oldList.urgent);
    genCard(restoredList);
    return restoredList;
  });
};

menuForm.addEventListener('click', function(e) {
  if (e.target.className === 'aside--form--submit-btn') {
    e.preventDefault();
    addItem(e);
  }
  if (e.target.id === 'aside--form--submit-task') {
    e.preventDefault();
    console.log('input');
    instantiateTask(e);
    taskItems = [];
    clearForm();
  }
  if (e.target.className === 'stage-list-delete') {
    e.target.closest('.aside--staged-item').remove();
  }
});

displayBox.addEventListener('click', function(e) {
  if (e.target.id === 'main--card--delete-btn') {
    e.target.closest('.main--article--card').remove();
    deleteList(e);
  }
});

function addItem(e) {
  event.preventDefault();
  var id = Date.now();
  addTaskToObj(id);
  stageItem(id);
  getAllTasks();
};

function clearForm() {
  taskItemPreview.innerHTML ='';
}

function stageItem(id) {
  var listItem = `
  <li class='aside--staged-item' data-id='${id}' id='${id}'>
    <input type='image' src='images/delete.svg' class='stage-list-delete'>
    <p class='stage-content'>${taskBody.value}</p>
  </li>`
  taskItemPreview.insertAdjacentHTML('beforeend', listItem);
};

function addTaskToObj(id) {
  var taskObj = {
    content: `${taskBody.value}`,
    id: `${id}`,
  }
  taskItems.push(taskObj);
  console.log(taskObj);
  console.log(taskItems);
}

function instantiateTask(e) {
  e.preventDefault();
  var task = new Task(taskTitle.value, taskItems);
  toDoStorage.push(task);
  task.saveToStorage(toDoStorage); 
  genCard(task);
}

function deleteList(e) {
  if (e.target.id === 'main--card--delete-btn') {
    e.target.closest('.main--article--card').remove();
    var removedTask = new Task();
    var targetId = parseInt(e.target.closest('.main--article--card').dataset.id);
    removedTask.deleteFromStorage(targetId);
  }
};
function reinstantiateItems(i) {
  console.log('wtff');
  return new Task(toDoStorage[i].title, toDoStorage[i].task, 
  toDoStorage[i].id, toDoStorage[i].urgent);
};

// function addToObj(id) {
//   var taskObj = {
//     title: `${taskTitle.value}`,
//     content: `${taskBody.value}`,
//     id: `${id}`,
//     done: false
//   }
//   taskItems.push(taskObj);
// }

function genCard(task) {
  var card = `
  <article class='main--article--card' data-id=${task.id}'>
    <section class='main--card--top'>
      <h3 class='main--card--title'>${task.title}</h3>
    </section>
    <section class='main--card--body'>
      <ul class='main--card--list' id='main--card${task.id}'></ul>
      ${getAllTasks(task)}
      </ul>
    </section>
    <section class='main--card--bottom'>
      <div class='main--card--icon-container'>
        <input type='image' src='images/urgent.svg' class='main--card--btn card-btn' id='main--card--urgent-btn'>
        <p class='main--card--text'>URGENT</p>
      </div>
      <div class='main--card--icon-container'>
        <input type='image' src='images/delete.svg' class='main--card--btn card-btn' id='main--card--delete-btn'>
        <p class='main--card--text'>DELETE</p>
      </div>
    </section>
  </article>`
  displayBox.insertAdjacentHTML('afterbegin', card);

}; 
 
function getAllTasks(stringItems) {
  var toDoString = '';
  for (var i = 0; i < stringItems.tasks.length; i++) {
    toDoString += `
    <p class = 'listItemsAppend'>
      <input type='image' class='card--check--icon' src='images/checkbox.svg' alt='checkbox' data-id=${stringItems.tasks.id} id ='index [i]'/>
      <p class='typed-to-do'>${stringItems.tasks[i].content}</p>
    </p>`
  }
  return toDoString;
} 
   
