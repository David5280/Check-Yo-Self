var toDoStorage = JSON.parse(localStorage.getItem('list')) || [];
var taskItems = [];
var searchInput = document.querySelector('#header--search')
var taskTitle = document.querySelector('#aside--form--title');
var taskBody = document.querySelector('#aside--form--task');
var taskSubmitBtn = document.querySelector('.aside--form--submit-btn');
var submitTasksBtn = document.querySelector('#aside--form--submit-task')
var taskItemPreview = document.querySelector('#aside--staging');
var clearAllBtn = document.querySelector('#aside--form--clear-btn');
var urgencyFilterBtn = document.querySelector('#aside--urgency-btn');
var menuForm = document.querySelector('#aside-form');
var displayBox = document.querySelector('#main--card-display');
var stagingArea = document.querySelector('.aside--staging');
var prompt = document.querySelector('.initialPrompt');

window.addEventListener('load', retrieveList);

function retrieveList() {
  toDoStorage = toDoStorage.map(function (oldList) {
    var restoredList = new Task(oldList.title, oldList.tasks, oldList.id, oldList.urgent);
    genCard(restoredList);
    checkStorage();
    return restoredList;
  });
};

menuForm.addEventListener('keyup', function(e) {
  if (e.target.id === 'aside--form--task') {
    checkTaskBody();
    checkInputFields();
  }
  if (e.target.id === 'aside--form--title') {
    checkInputFields();
  }
});


menuForm.addEventListener('click', function(e) {
  if (e.target.className === 'aside--form--submit-btn') {
    e.preventDefault();
    addItem();
    checkStorage();
  }
  if (e.target.id === 'aside--form--submit-task') {
    e.preventDefault();
    instantiateTask(e);
    taskItems = [];
    checkInputFields(e);
    clearForm();
    checkStorage();
  }
  if (e.target.className === 'stage-list-delete') {
    e.preventDefault();
    e.target.closest('.aside--staged-item').remove();
  }
  if (e.target.className === '.clearAllBtn') {
    e.preventDefault();
    clearForm();
    menuForm.reset();
  }
});






displayBox.addEventListener('click', function(e) {
  if (e.target.id === 'main--card--delete-btn') {
    e.target.closest('.main--article--card').remove();
    deleteList(e);
  }
});

function checkTaskBody() {
  if (taskBody.value !== '') {
    taskSubmitBtn.disabled = false;
    // taskSubmitBtnclassList.add('enable');
  }
  if (taskBody.value === '') {
    taskSubmitBtn.disabled = true;
    // taskSubmitBtnclassList.remove('enable'); 
  }
}

function checkInputFields() {
	if (taskTitle.value !== '' && taskItems.length > 0) {
    console.log('enable');
    submitTasksBtn.disabled = false;
    submitTasksBtn.classList.add('enable');
	} else {
    console.log('disable')
    submitTasksBtn.disabled = true;
    submitTasksBtn.classList.remove('enable');
	};
};

function checkStorage() {
   toDoStorage.length > 0 ? prompt.classList.add('hide') : prompt.classList.remove('hide');
}

function addItem(e) {
  event.preventDefault();
  var id = Date.now();
  addTaskToObj(id);
  checkInputFields(e);
  stageItem(id);
  getAllTasks(toDoStorage);
};

function clearForm() {
  taskItemPreview.innerHTML ='';
  menuForm.reset();
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
    urgent: false,
    checked: false
  }
  console.log(taskObj);
  taskItems.push(taskObj);
}

function instantiateTask(e) {
  e.preventDefault();
  var task = new Task(taskTitle.value, taskItems, Date.now(), false);
  toDoStorage.push(task);
  task.saveToStorage(toDoStorage); 
  genCard(task);
}

function deleteList(e) {
  toDoStorage.forEach(function(item, i) {
    var myList = reinstantiateItems(i);
    var cardId = parseInt(e.target.parentNode.parentNode.parentNode.dataset.id);
    if (cardId == item.id) {
      myList.deleteFromStorage(i, toDoStorage);
    };
    checkStorage();
  });
};

function reinstantiateItems(i) {
  console.log('reinstantiate');
  console.log(new Task(toDoStorage[i].title, toDoStorage[i].tasks, 
  toDoStorage[i].id, toDoStorage[i].urgent));
  return new Task(toDoStorage[i].title, toDoStorage[i].tasks, 
    toDoStorage[i].id, toDoStorage[i].urgent);
  
};

function genCard(task) {
  var card = `
  <article class='main--article--card' data-id=${task.id}>
    <section class='main--card--top'>
      <h3 class='main--card--title'>${task.title}</h3>
    </section>
    <section class='main--card--body'>
      <ul class='main--card--list' id='main--card${task.id}>
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
 
function getAllTasks(storage) {
  var toDoString = '';
  for (var i = 0; i < storage.tasks.length; i++) {
    toDoString += `
    <div class='listItemsContainer'>
      <li class = 'listItemsAppend'>
        <input type='image' class='card--check--icon' src='images/checkbox.svg' alt='checkbox' data-id=${storage.tasks.id} id ='index [i]'/>
        <p class='typed-to-do'>${storage.tasks[i].content}</p>
      </li>
    </div>`
  }
  return toDoString;
} 
   
