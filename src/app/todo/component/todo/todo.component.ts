import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../service/todo.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/service/local-storage/local-storage.service';
import { Todo } from '../../types/Todo';
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { UUIDService } from 'src/app/shared/service/uuid/uuid.service';
import { BaseTallyComponent } from 'src/app/shared/components/base-tally/base-tally.component';
import { TallyService } from 'src/app/tally/service/tally.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  protected todos = Array<Todo>();
  private todoListObservable!: Subscription;
  protected todosFetched: boolean = false;
  protected todoFetched: boolean = false;
  protected todoForm!: FormGroup;
  protected removeTodoModalData: Object = {};
  protected todoObservable!: Subscription;
  protected todo: Todo = new Todo({});
  protected editMode: boolean = false;
  protected editId!: string;
  protected showTodoForm: boolean = false;

  constructor(
    protected localStorageService: LocalStorageService,
    protected todoService: TodoService,
    private location: Location,
    private router: Router,
    private uUIDService: UUIDService) {

      this.todoForm = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', [Validators.required])
      });

  }

  ngOnInit(): void {
    this.todoListObservable = this.todoService.getTodos().subscribe(todos => {
      this.todosFetched = true;
      this.todos = todos;
    });
    this.setupMode();
  }

  setupMode(): void {
    if (this.location.path().split('/').length === 3) {
      this.editMode = true;
      this.showTodoForm = true;
      this.editId = this.location.path().split('/')[2];

      try {
        this.todoObservable = this.todoService.getTodoById(this.editId).subscribe(todo => {
          this.todo = todo;
          this.todoFetched = true;
        });
      }
      catch (e) {
        console.log(e);
        this.location.back();
      }
    }
    else {
      this.todo = this.todoService.getEmptyTodo();
      this.todo.setUuid(this.uUIDService.UUID());
    }
    this.setupFormGroup(this.todo)
  }

  setupFormGroup(todo: Todo): void {

    this.todoForm = new FormGroup({
      title: new FormControl(todo.getTitle(), [Validators.required]),
      description: new FormControl(todo.getDescription(), [Validators.required]),
      done: new FormControl(todo.getIsDone())
    });
  }

  onSubmit() {
    this.todo.setTitle(this.todoForm.value.title);
    this.todo.setDescription(this.todoForm.value.description);
    this.todo.setLastTouched(new Date());
    this.todo.setIsDone(this.todoForm.value.done === true ? true : false);

    let action: string = 'skapad';
    if (this.editMode) {
      this.todo.setCreated(this.todo.getCreated());
      this.todoService.update(this.todo);
      action = 'uppdaterad';
    }
    else {
      this.todo.setCreated(new Date());
      this.todoService.save(this.todo, 'todos');
    }
    this.ngOnInit();
    this.todoForm.reset();
    this.editMode = false;
    this.showTodoForm = false;
    this.router.navigate(['/todo'], { queryParams: { type: 'success', message: 'Att göra post ' + action } });
  }

  deleteTodoConfirmed(){
    if(this.location.path().split('/')[2]){
      this.todoService.delete(this.location.path().split('/')[2]);
      this.router.navigate(['/todo']);
    }
  }

  deleteTodo() {
    this.removeTodoModalData = {
      open: true,
      header: 'Radera Att göra post',
      body: 'Är du säker på att du vill radera att göra posten?',
      footer: ''
    }
  }


  handleForm(): void{
    // Ångra, stäg förmuläret
    if(this.editMode || (this.editMode === false && this.showTodoForm === true)){
      
      this.router.navigate(['/todo/']);
      this.showTodoForm = false;
    }
    // Visa formulärt
    else {
      this.showTodoForm = true;
    }
  }
  

} 
