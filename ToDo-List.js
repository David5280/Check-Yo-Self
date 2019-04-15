class Task {
  constructor(title, task, id, urgent) {
    this.title = title;
    this.tasks = task || [];
    this.id = id;
    this.urgent = urgent;
  };
  saveToStorage(toDoStorage) {
    localStorage.setItem('list', JSON.stringify(toDoStorage));
  };
  deleteFromStorage(index, toDoStorage) {
    toDoStorage.splice(index, 1);
    this.saveToStorage(toDoStorage);
  };
  updateList(toDoStorage, index, urgent) {
    urgent ? toDoStorage[index].urgent = true : toDoStorage[index].urgent = false;
    this.saveToStorage(toDoStorage);
  };
};

