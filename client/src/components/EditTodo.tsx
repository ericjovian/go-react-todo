import { useForm } from "@mantine/form";
import { Button, Modal, TextInput, Textarea } from "@mantine/core";
import { ENDPOINT, Todo } from "../App";

interface Props {
  id: number;
  initialTitle: string;
  initialBody: string;
  onClose: () => void;
  mutate: () => void;
}

interface FormValues {
  title: string;
  body: string;
}

function EditTodo({ id, initialTitle, initialBody, onClose, mutate }: Props) {
  const form = useForm<FormValues>({
    initialValues: {
      title: initialTitle,
      body: initialBody,
    },
  });

  const editTodo = async (id: number, values: FormValues) => {
    const response = await fetch(`${ENDPOINT}/api/todos/${id}/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
  
    const updatedTodo = await response.json() as Todo;
  
    // Call mutate to update the list of todos after editing a todo
    mutate();
    
    form.reset();
    onClose();
  }

  return (
    <Modal
      title="Edit Todo"
      onClose={() => {
        form.reset();
        onClose();
      }}
      size="md"
      padding="sm"
      opened={true}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          editTodo(id, form.values);
        }}
      >
        <TextInput
          required
          label="Title"
          placeholder="Enter a title for your todo"
          value={form.values.title}
          onChange={(event) => form.setFieldValue("title", event.currentTarget.value)}
        />
        <Textarea
          required
          label="Description"
          placeholder="Enter a description for your todo"
          value={form.values.body}
          onChange={(event) => form.setFieldValue("body", event.currentTarget.value)}
        />
        <Button type="submit" variant="outline" style={{ marginTop: "10px" }}>
          Save
        </Button>
      </form>
    </Modal>
  );
}

export default EditTodo;
