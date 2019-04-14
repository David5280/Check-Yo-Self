class Task {
  constructor(title, task, id, urgent) {
    this.title = title;
    this.tasks = task || [];
    this.id = id;
    this.urgent = urgent || false;
  };

  saveToStorage(toDoStorage) {
    localStorage.setItem('list', JSON.stringify(toDoStorage));
  };

  deleteFromStorage(index) {
    toDoStorage.splice(index, 1);
    this.saveToStorage(toDoStorage);
  };

  updateIdea(toDoStorage, index, star) {
    star ? toDoStorage[index].star = true : toDoStorage[index].star = false;
    this.saveToStorage(toDoStorage);
  };
};

