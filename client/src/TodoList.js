import React, { Component } from 'react';

class TodoList extends Component{


    render() {
        return (
          <div>
            <ul id="taskList" className="list-unstyled">
            <form onSubmit={(event) => {
                event.preventDefault()
                this.props.createTask(this.task.value)
                  }}>
                <div className="ui search">
                <div className="ui icon input">
                <input class="prompt" type="text" 
                id="newTask"
                ref={(input) => {
                  this.task = input
                }}
                type="text"
                className="ui search"
                placeholder="Add task..."
                required />
                <i class="search icon"></i>
                </div>
            </div>
            </form>
              <input type="submit" hidden={true} />
              { this.props.tasks.map((task, key) => {
                return(

                    <div class="ui middle aligned divided list">
                        <div class="item">
                            <div class="right floated content">
                            <button 
                            id={task.id}
                            onClick={(event)=>{
                                console.log(event.target.id)
                                this.props.toggleCompleted(event.target.id)
                            }}
                            class={task.completed ?"ui red button":"ui acrive button"}>
                            <i class="user icon"></i>
                            Check
                            </button>
                            </div>
                            <div class="content">{task.content}</div>
                        </div>
                    </div>
                )
              })}
            </ul>
          </div>
        );
      }
}
/*
return(
    <div className="taskTemplate" className="checkbox" key={key}>
      <label>
        <input
        type="checkbox"
        name={task.id}
        defaultChecked={task.completed}
        ref={(input) => {
          this.checkbox = input
        }}
        onClick={(event) => {
          this.props.toggleCompleted(this.checkbox.name) }}/>
        <span className="content">{task.content}</span>
      </label>
    </div>
  )
  */
export default TodoList;