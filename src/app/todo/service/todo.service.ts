import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/service/local-storage/local-storage.service';
import { Todo } from '../types/Todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService  {

  lsTodos = Array<Object>();
  todos: Array<Todo> = []
  

  constructor(
    private localStorageService: LocalStorageService,

  ) { }

  getTodos(): Observable<Todo[]> {
    return new Observable<Todo[]>(observer => {
      this.lsTodos = this.localStorageService.getAllTodos();
      this.todos = <Array<Todo>>this.convertLSToTodos(this.lsTodos);
      observer.next(this.todos);
    });
  }


  addTodo(){

  }

  getTodoById(id: String): Observable<Todo> {
    return new Observable<Todo>(observer => {
      let todo: Todo = this.getEmptyTodo();
      let found = false;
      this.todos.forEach(eachTodos => {
        if (eachTodos.getUuid() === id) {
          todo = eachTodos;
          found = true;
        }
      });

      if (!found) {
        let objArr: Array<object> = this.localStorageService.getTodo(id);
        todo = this.convertLSToTodos(objArr)[0];
      }
      observer.next(todo);
    });
  }


  getEmptyTodo() {
    return new Todo({
      uuid: null,
      title: null,
      description: null,
      done: null,
      created: null,
      lastTouched: null
    });
  }


  convertLSToTodos(lsTodos: Array<object>): Todo[] {
    const returnArr = new Array<Todo>();
    for (const obj of lsTodos) {
      let todo = new Todo(obj);
      todo.setCreated(new Date(todo.getCreated()));
      returnArr.push(todo);
    }
    return returnArr;
  }

  touch(todo: Todo): void {
    todo.setLastTouched(new Date());
  }

  save(todo: Todo): void {
    this.localStorageService.addTodo(this.convertToLsTodo(todo));
  }

  update(todo: Todo): void {
    this.localStorageService.updateTodo(this.convertToLsTodo(todo));
  }

  delete(id: string): void {
    this.localStorageService.removeTodo(id);
  }

  convertToLsTodo(todo: Todo): Object {
    const plainObject: Object = Object.assign({}, todo);
    return plainObject;
  }
}
