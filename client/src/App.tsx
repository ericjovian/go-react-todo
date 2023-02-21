import {Box, Flex, List, ThemeIcon} from '@mantine/core'
import useSWR from "swr"
import Pencil from './assets/pencil.svg'
import Bin from './assets/bin.svg'
import './App.css'
import AddTodo from "./components/AddTodo"

// Define a TypeScript interface for the Todo object
export interface Todo{
  id: number;
  title: string;
  body: string;
  done: boolean;
}

// Define the endpoint where the backend API is running
export const ENDPOINT = 'http://localhost:4000'

// Define a function to fetch data from the API using swr library
const fetcher = (url: string) => fetch(`${ENDPOINT}/${url}`).then((r) => r.json())

// Define the main App component
function App() {
  // Fetch the list of todos from the API using useSWR hook
  const { data, mutate } = useSWR<Todo[]>('api/todos', fetcher);

  // Define a function to mark a todo as done
  async function markTodoAsDone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/done`, { method: 'PATCH' }).then(r => r.json());
    // Call mutate to update the list of todos after marking a todo as done
    mutate(updated);
  }

  // Define a function to mark a todo as undone
  async function markTodoAsUndone(id: number) {
    const updated = await fetch(`${ENDPOINT}/api/todos/${id}/undone`, { method: 'PATCH' }).then(r => r.json());
    // Call mutate to update the list of todos after marking a todo as undone
    mutate(updated);
  }

  // Define a function to delete a todo
  async function deleteTodo(id: number) {
    await fetch(`${ENDPOINT}/api/todos/${id}`, { method: 'DELETE' });
    // Call mutate to update the list of todos after deleting a todo
    mutate();
  }  

  // Render the UI using Mantine's Box and List components
  return (
    <Box sx={(theme) => ({
      padding: "2rem",
      width: "100%",
      maxWidth: "40rem",
      margin: "0 auto",
    })}>
      <List spacing="xs" size="sm" mb={12} center>
        {/* Render each todo item in the list */}
        {data?.map((todo) => {
          return (
            <Flex justify="space-between" align="flex-center" direction="row" gap="xl">
              {/* Render the todo item with an icon that indicates if it's done or not */}
              <List.Item
                onClick={() => todo.done ? markTodoAsUndone(todo.id) : markTodoAsDone(todo.id)}
                key={`todo__${todo.id}`}
                icon={
                  todo.done ? (
                    <ThemeIcon color="teal" size={24} radius="xl">
                      ✓
                    </ThemeIcon>
                  ) : (
                    <ThemeIcon color="gray" size={24} radius="xl">
                      ✓
                    </ThemeIcon>
                  )
                }
                style={{ color: '#fff' }}
              >
                {todo.title}
              </List.Item>
              {/* Render a button to delete the todo item */}
                <Flex gap={'xs'} style={{ height:"20px" }}>
                  {/* <img src={Pencil} alt="edit" itemType="clickable" style={{ cursor: "pointer"}} /> */}
                  <img src={Bin} alt="delete" itemType="clickable" onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }} style={{ cursor: "pointer" }}/>
                </Flex>
            </Flex>
          )
        })}
      </List>
      {/* Render a component to add a new todo item */}
      <AddTodo mutate={mutate} />
    </Box>
  )
}

export default App 
