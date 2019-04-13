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


function addItem() {
  e.preventDefault();
  var id = Date.now();
  stageItem(id);
  addToObj(id);
  validateInput();
}
function stageItem(id) {
  var listItem = `
  <li class='staged-item' data-id='${id}' id='${id}'>
    <input type='image' src='images/delete.svg' class='stage-list-delete'>
    <p class='stage-content'>${taskBody.value}</p>
  </li>`
  taskItemPreview.insertAdjacentHTML('beforeend', listItem);
}
 