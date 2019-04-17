class Task {
  constructor(title, task, id, urgent, done) {
    this.title = title;
    this.tasks = task || [];
    this.id = id;
    this.urgent = urgent;
    this.done = done || false;
  };
  saveToStorage() {
    localStorage.setItem('list', JSON.stringify(toDoStorage));
  };
  deleteFromStorage(index) {
    toDoStorage.splice(index, 1);
    this.saveToStorage();
  };
  updateList() {
    this.urgent = !this.urgent
    this.saveToStorage();
  };
  updateToDos(taskIndex) {
    this.tasks[taskIndex].checked = !this.tasks[taskIndex].checked;
    this.saveToStorage();
  }
};

