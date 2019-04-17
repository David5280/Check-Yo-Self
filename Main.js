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
    trackUrgency(restoredList);
    checkStorage();
    return restoredList;
  });
};

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
    e.target.closest('.main--article--card').remove();
    deleteList(e);
  }
  if (e.target.id === 'main--card--urgent-btn') {
    updateUrgency(e); 
  }
  if (e.target.className === 'card--check--icon') {
    checkBox(e);
    completeTask(e);
  }
});

// Functions

function addItem() {
  var id = Date.now();
  addTaskToObj(id);
  checkInputFields();
  stageItem(id);
  getAllTasks(id);
  clearTaskItemInput();
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
        <input type='image' class='card--check--icon' src='images/checkbox.svg' alt='checkbox' data-id=${storage.tasks[i].id} id ='index [i]'/>
        <p class='typed-to-do' id=${storage.tasks[i].id}>${storage.tasks[i].content}</p>
      </li>
    </div>`
  }
  return toDoString;
} 

function instantiateTask(e) {
  e.preventDefault();
  var task = new Task(taskTitle.value, taskItems, Date.now(), false);
  toDoStorage.push(task);
  trackUrgency(task);
  task.saveToStorage(toDoStorage);
}

function reinstantiateItems(i) {
  return new Task(toDoStorage[i].title, toDoStorage[i].tasks, 
   toDoStorage[i].id, toDoStorage[i].urgent);
};

function checkTaskBody() {
  if (taskBody.value !== '') {
    taskSubmitBtn.disabled = false;
    // taskSubmitBtn.classList.add('enable');
  }
  if (taskBody.value === '') {
    taskSubmitBtn.disabled = true;
    // taskSubmitBtn.classList.remove('enable'); 
  }
}

function deleteStagedItems(e) {
  e.preventDefault();
  e.target.closest('.aside--staged-item').remove();
  taskItems.forEach(task => {
  if(task.id === e.target.parentNode.id) {
  index = taskItems.indexOf(task)
  taskItems.splice(index, 1);
  }
});
}

function makeTaskListFunc(e) {
  e.preventDefault();
  instantiateTask(e);
  taskItems = [];
  checkInputFields(e);
  clearForm();
  checkStorage();
}

function checkStorage() {
   toDoStorage.length > 0 ? prompt.classList.add('hide') : prompt.classList.remove('hide');
}

function clearForm() {
  taskItemPreview.innerHTML ='';
  menuForm.reset();
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

function genCard(task, urgentValue) {
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
        <input type='image' src=${urgentValue} class='main--card--btn card-btn' id='main--card--urgent-btn'>
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

function targetIndex(e) {
  var targetCard = e.target.closest('.main--article--card');
  var targetId = parseInt(targetCard.getAttribute('data-id'));
  var taskIndex = toDoStorage.findIndex(obj => obj.id === targetId);
  return taskIndex;
}

function updateUrgency(e) {
  if (e.target.src.match('images/urgent.svg')) {
    e.target.src = 'images/urgent-active.svg';
    urgent = true;
  } else {
    e.target.src = 'images/urgent.svg'
    urgent = false;
  }
  console.log(urgent);
  saveUrgency(e, urgent);
}

function saveUrgency(e, urgent) {
  toDoStorage.forEach(function(list, index) {
    var myList = reinstantiateItems(index);
    var cardId = parseInt(e.target.parentNode.parentNode.parentNode.dataset.id);
    if (cardId === list.id) {
      myList.updateList(toDoStorage, index, urgent);
    }
  })
};

function trackUrgency(task) {
  if (task.urgent === true) {
    var urgentValue = 'images/urgent-active.svg';
  } else if (task.urgent === false) {
    urgentValue = 'images/urgent.svg'
  } 
  genCard(task, urgentValue);
};

function checkBox(e) {
  if (e.target.src.match('images/checkbox.svg')) {
    e.target.src = 'images/checkbox-active.svg';
    e.target.parentNode.parentNode.checked = true;
  } else {
    e.target.src = 'images/checkbox.svg'
    e.target.checked = false;
  };
};

function completeTask(e) {
  var i = targetIndex(e);
  var counter = 0;
  toDoStorage[i].tasks.forEach(function(task) {
    task.done ? counter++ : counter--;
  })
};
