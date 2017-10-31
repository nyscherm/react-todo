//add item
const TodoForm = ({addTodo}) => {
  // Input tracker
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        addTodo(input.value);
        input.value = '';
      }}>
        +
      </button>
    </div>
  );
};

//list item
const Todo = ({todo, remove}) => {
  // Each Todo
  return (<li onClick={() => {(remove(todo.id))}}><div>{todo.text}</div></li>);
}

//teh list of items
const TodoList = ({todos, remove}) => {
  // Map through the todos
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove}/>)
  });
  return (<ul>{todoNode}</ul>);
}
         
// I just hold the banner guys
const Title = ({todoCount}) => 
  <div>
    <div>
      <h1>To-Do (count: {todoCount})</h1>
    </div>
  </div>

window.id = 0;
class TodoApp extends React.Component{
  constructor(props){
    // Pass props to parent class
    super(props);
    // Set initial state
    this.state = {
      data: []
    }
    this.apiUrl = 'https://59f80597d4d1700012b761f7.mockapi.io/todo'
  }
  componentDidMount(){
    // Make HTTP request with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
      });
  }
  // Add todo handler
  addTodo(val){
    // Assemble data
    const todo = {text: val}
    // Update data
    axios.post(this.apiUrl, todo)
    .then((res) => {
      this.state.data.push(res.data);
      // Update state
      this.setState({data: this.state.data});
    });
  }
  // Handle remove
  handleRemove(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    // Update state with filter
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      });
  }

  render(){
    // Render JSX
    return (
      <div>
        <Title todoCount={this.state.data.length} />
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <TodoList 
          todos={this.state.data} 
          remove={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}

ReactDOM.render(<TodoApp />, document.getElementById('container'));