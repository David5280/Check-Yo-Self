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

// Event Delegation

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
    makeTaskListFunc(e)
  }
  if (e.target.className === 'stage-list-delete') {
    deleteStagedItems(e);
};

  if (e.target.className === '.clearAllBtn') {
    e.preventDefault();
    clearForm();
    menuForm.reset();
  }
});

displayBox.addEventListener('click', function(e) {
  if (e.target.id === 'main--card--delete-btn') {
    deleteList(e);
  }
  if (e.target.id === 'main--card--urgent-btn') {
    updateUrgency(e); 
  }
  if (e.target.className.includes('card--check--icon')) {
    checkBox(e);
    toggleCardDeleteBtn(e);
  }
});

// Functions

function retrieveList() {
  toDoStorage = toDoStorage.map(function (oldList) {
    var restoredList = new Task(oldList.title, oldList.tasks, oldList.id, oldList.urgent);
    trackUrgency(restoredList);
    checkStorage();
    return restoredList;
  });
};

function addItem() {
  var id = Date.now();
  addTaskToObj(id);
  stageItem(id);
  checkInputFields();
  clearTaskItemInput();
  getAllTasks(id);
};

function addTaskToObj(id) {
  var taskObj = {
    content: `${taskBody.value}`,
    id: `${id}`,
    checked: false
  }
  taskItems.push(taskObj);
};

function checkInputFields() {
	if (taskTitle.value !== '' && taskItems.length > 0) {
    submitTasksBtn.disabled = false;
    submitTasksBtn.classList.add('enable');
    clearAllBtn.disabled = false;
    clearAllBtn.classList.add('enable');
	  } else {
    submitTasksBtn.disabled = true;
    submitTasksBtn.classList.remove('enable');
    clearAllBtn.disabled = true;
    clearAllBtn.classList.remove('enable');
	};
};

function checkTaskBody() {
  if (taskBody.value !== '') {
    taskSubmitBtn.disabled = false;
  }
  if (taskBody.value === '') {
    taskSubmitBtn.disabled = true;
  };
};

function stageItem(id) {
  var listItem = `
  <li class='aside--staged-item' data-id='${id}' id='${id}'>
    <input type='image' src='images/delete.svg' class='stage-list-delete' id=${id}>
    <p class='stage-content'>${taskBody.value}</p>
  </li>`
  taskItemPreview.insertAdjacentHTML('beforeend', listItem);
};

function getAllTasks(storage) {
  var toDoString = '';
  for (var i = 0; i < storage.tasks.length; i++) {
    toDoString += `
    <div class='listItemsContainer'>
      <li class = 'listItemsAppend' data-id=${storage.tasks[i].id} id=${storage.tasks[i].id}>
        <input type='image' class='card--check--icon' src='${storage.tasks[i].checked ? 'images/checkbox-active.svg' : 'images/checkbox.svg' }' alt='checkbox' data-id=${storage.tasks[i].id} id ='index [i]'/>
        <p class='typed-to-do ${storage.tasks[i].checked ? 'checked' : null} card--check--icon' id=${storage.tasks[i].id}>${storage.tasks[i].content} </p>
      </li>
    </div>`
  }
  return toDoString;
} 

function clearTaskItemInput() {
  taskBody.value = '';
};

function instantiateTask(e) {
  e.preventDefault();
  var task = new Task(taskTitle.value, taskItems, Date.now(), false);
  toDoStorage.push(task);
  trackUrgency(task);
  task.saveToStorage();
};

function reinstantiateItems(i) {
  return new Task(toDoStorage[i].title, toDoStorage[i].tasks, 
   toDoStorage[i].id, toDoStorage[i].urgent);
};

function deleteStagedItems(e) {
  e.preventDefault();
  e.target.closest('.aside--staged-item').remove();
  taskItems.forEach(task => {
  if(task.id === e.target.parentNode.id) {
  index = taskItems.indexOf(task)
  taskItems.splice(index, 1);
  }
  checkInputFields();
});
};

function makeTaskListFunc(e) {
  e.preventDefault();
  checkInputFields(e);
  instantiateTask(e);
  taskItems = [];
  clearForm();
  checkStorage();
};

function checkStorage() {
   toDoStorage.length > 0 ? prompt.classList.add('hide') : prompt.classList.remove('hide');
};

function clearForm() {
  taskItemPreview.innerHTML ='';
  menuForm.reset();
};

function deleteList(e) {
  e.target.closest('.main--article--card').remove();
  toDoStorage.forEach(function(item, i) {
    var myList = reinstantiateItems(i);
    var cardId = parseInt(e.target.parentNode.parentNode.parentNode.dataset.id);
    if (cardId == item.id) {
      myList.deleteFromStorage(i, toDoStorage);
    };
    checkStorage();
  });
};

function genCard(task, urgentValue) {
  var card = `
  <article class='main--article--card ${task.urgent === true ? 'urgent' : null}' data-id=${task.id}>
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
        <input type='image' src=${urgentValue} class='main--card--btn card-btn' id='main--card--urgent-btn'>
        <p class='main--card--text'>URGENT</p>
      </div>
      <div class='main--card--icon-container'>
        <input type='image' src='images/delete.svg' class='main--card--btn card-btn' id='main--card--delete-btn' disabled>
        <p class='main--card--text'>DELETE</p>
      </div>
    </section>
  </article>`
  displayBox.insertAdjacentHTML('afterbegin', card);
}; 

function targetIndex(card) {
  var cardId = (parseInt(card.dataset.id));
  return toDoStorage.findIndex(obj => obj.id == cardId);
};

function targetTaskIndex(taskId, object) {
  return object.tasks.findIndex(item => item.id == taskId);
};

function updateUrgency(e) {
  var card = e.target.closest('.main--article--card')
  var index = targetIndex(card);
  toDoStorage[index].updateList()
  if (e.target.src.match('images/urgent.svg')) {
    e.target.src = 'images/urgent-active.svg';
  } else {
    e.target.src = 'images/urgent.svg'
  }
  toggleUrgentClass(e);
  saveUrgency(e);
};

function saveUrgency(e) {
  toDoStorage.forEach(function(list, index) {
    var myList = reinstantiateItems(index);
    var cardId = parseInt(e.target.parentNode.parentNode.parentNode.dataset.id);
    if (cardId === list.id) {
      myList.updateList(myList);
    };
  });
};

function trackUrgency(task) {
  if (task.urgent === true) {
    var urgentValue = 'images/urgent-active.svg';
  } else if (task.urgent === false) {
    urgentValue = 'images/urgent.svg'
  } 
  genCard(task, urgentValue);
};

function toggleUrgentClass(e) {
  var targetCard = e.target.closest('article'); 
  targetCard.classList.toggle('urgent');
};

function checkBox(e) {
  console.log(e)
  var taskId = e.target.dataset.id;
  var card = e.target.closest('.main--article--card')
  var index = targetIndex(card);
  var object = toDoStorage[index];
  var taskIndex = targetTaskIndex(taskId, object);
  object.updateToDos(taskIndex);
  if (e.target.src.match('images/checkbox.svg')) {
    e.target.src = 'images/checkbox-active.svg';
    e.target.parentNode.parentNode.checked = true;
    e.target.parentNode.childNodes[3].classList.add('checked');
  } else {
    e.target.src = 'images/checkbox.svg'
    e.target.checked = false;
    e.target.parentNode.childNodes[3].classList.remove('checked');
  };
  toggleCardDeleteBtn(e);
};

function toggleCardDeleteBtn(e) {
  var card = e.target.closest('.main--article--card')
  var cardDeleteBtn = document.querySelector('#main--card--delete-btn')
  var index = targetIndex(card);
  var object = toDoStorage[index];
  var lengthOfToDo = object.tasks.length
  var toDoTaskArray = object.tasks.filter(task => task.checked); 
  var numOfCheckedTasks = toDoTaskArray.length
  if (lengthOfToDo === numOfCheckedTasks) {
    cardDeleteBtn.disabled = false;
  } else {
    cardDeleteBtn.disabled = true;
  };
};
