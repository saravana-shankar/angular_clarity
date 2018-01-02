import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {ActivatedRoute ,Router} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'clr-icons';

declare const $: any;
@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  userTodos = [];
  allTodos = [];
  id: number;
  username : string;
  newTodo : string;
  private sub: any;
  emptyTodoAlert : boolean = false;

  constructor(
    private http:Http,
    private route: ActivatedRoute,
    private router: Router
  ) { } 

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = +params['userId']; 
       this.username = params['userName'];

       this.http.get('https://jsonplaceholder.typicode.com/todos?userId='+this.id)
          .map(res => res.json())
          .subscribe(userTodos => { 
            this.userTodos = userTodos;
            $(window)[0].localStorage.setItem("user"+this.id,JSON.stringify({"todos" : this.userTodos}));
          });
    });
  }

  addTodo() {
    if(this.newTodo) {
      this.emptyTodoAlert = false;
      if($(window)[0].localStorage && $(window)[0].localStorage.getItem("user"+this.id)) {
        this.userTodos = JSON.parse($(window)[0].localStorage.getItem("user"+this.id)).todos;
        var newTodoObj = {
          userId : this.id,
          id : new Date().getTime(),
          completed : false,
          title : this.newTodo
        };
        this.userTodos.push(newTodoObj);
        this.newTodo = null;
        $(window)[0].localStorage.setItem("user"+this.id,JSON.stringify({"todos" : this.userTodos}));
      }
    } else {
      this.emptyTodoAlert = true;
      let timeoutId = setTimeout(() => {  
        this.emptyTodoAlert = false;
        clearTimeout(timeoutId);
      }, 3000);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goToUsers() {
    this.router.navigate(['/users']);
  }

  changeTodoCompletion(changedTodo) {
    changedTodo.completed = !changedTodo.completed;
    if($(window)[0].localStorage && $(window)[0].localStorage.getItem("user"+this.id)) {
      this.userTodos = JSON.parse($(window)[0].localStorage.getItem("user"+this.id)).todos;
      this.userTodos = this.userTodos.map(
        function(key, val, array){
          if(key.id === changedTodo.id) {
            key.completed = changedTodo.completed;
          }
          return key;
      });
      $(window)[0].localStorage.setItem("user"+this.id,JSON.stringify({"todos" : this.userTodos}));
    }
  }

  removeTodo(todoRemove) {
    if($(window)[0].localStorage && $(window)[0].localStorage.getItem("user"+this.id)) {
      this.userTodos = JSON.parse($(window)[0].localStorage.getItem("user"+this.id)).todos;
      this.userTodos = this.userTodos.filter(todo => todo.id !== todoRemove.id);
      $(window)[0].localStorage.setItem("user"+this.id,JSON.stringify({"todos" : this.userTodos}));
    }
  }

}
