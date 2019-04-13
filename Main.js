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

menuForm.addEventListener('click', function(e) {
  if (e.target.className === 'aside--form--submit-btn') {
    e.preventDefault();
    addItem(e);
    console.log('staged');
  }
  if (e.target.id === 'aside--form--submit-task') {
    e.preventDefault();
    console.log('gen card');
    instantiateTask();
  }
});

function checkInputFields() {
	if (taskBody.value !== '') {
    taskSubmitBtn.disabled = false;
    taskSubmitBtn.classList.add('enable');
	} else {
    taskSubmitBtn.disabled = true;
    taskSubmitBtn.classList.remove('enable');
	};
};

function stageItem(id) {
  var listItem = `
  <li class='aside--staged-item' data-id='${id}' id='${id}'>
    <input type='image' src='images/delete.svg' class='stage-list-delete'>
    <p class='stage-content'>${taskBody.value}</p>
  </li>`
  taskItemPreview.insertAdjacentHTML('beforeend', listItem);
};

function instantiateTask(e) {
  event.preventDefault();
  var task = new Task(taskTitle.value, taskBody.value, Date.now());
  toDoStorage.push(task);
  task.saveToStorage(toDoStorage);
  genCard(task);
  // genCardItems(task);
  console.log('initiate');
}

function reinstantiateItems(i) {
  return new Task(toDoStorage[i].title, toDoStorage[i].task, 
  toDoStorage[i].id, toDoStorage[i].urgent)
};

function addItem() {
  event.preventDefault();
  var id = Date.now();
  stageItem(id);
  addToObj(id);
  // validateInput();
};
function addToObj(id) {
  var taskObj = {
    content: `${taskBody}`,
    id: `${id}`,
  }
}

function genCard(task) {
  var card = `
  <article class='main--article--card' data-id='main--article--card${task.id}'
    <section class='main--card--top'>
      <h3 class='main--card--title'>${task.title}</h3>
     </section>
        <ul class='main--card--list' id='main--card${task.id}'
       </ul>
     <section class='main--card--bottom'>
        <div class='main--card--urgent'>
          <input type='image' src='images/urgent.svg' class='main--card--btn' id='main--card--urgent-btn'>
          <p class='main--card--urgent-text>URGENT</p>
        </div>
        <div class='main--card--delete'>
          <input type='image' src='images/delete.svg' class='main--card--btn' id='main--card--delete-btn'>
         <p class='main--card--delete-text'>DELETE</p>
      </div>
    </section>
  </article>`
  displayBox.insertAdjacentHTML('afterbegin', card);
};
 