package main

import (
	"log"

	"github.com/gofiber/fiber/v2"                 // Import the fiber package
	"github.com/gofiber/fiber/v2/middleware/cors" // Import the cors middleware
)

type Todo struct { // Define a struct for a Todo item
	ID    int    `json:"id"`    // ID of the todo item
	Title string `json:"title"` // Title of the todo item
	Done  bool   `json:"done"`  // Whether the todo item is done or not
	Body  string `json:"body"`  // Body of the todo item
}

func main() {
	app := fiber.New() // Create a new fiber app

	// Use the cors middleware to allow requests from a specific origin
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://127.0.0.1:5173",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	todos := []Todo{} // Initialize an empty slice to hold Todo items

	// Define a route to get all the Todo items
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos) // Return the Todo items as a JSON response
	})

	// Define a route to add a new Todo item
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil { // Parse the request body to get the new Todo item
			return err // Return an error if parsing the request body fails
		}

		todo.ID = len(todos) + 1     // Set the ID of the new Todo item
		todos = append(todos, *todo) // Append the new Todo item to the slice
		return c.JSON(todos)         // Return the updated Todo items as a JSON response
	})

	// Define a route to delete a Todo item by its ID
	app.Delete("/api/todos/:id", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id") // Get the ID parameter from the URL
		if err != nil {
			return c.Status(401).SendString("Invalid id") // Return an error if the ID is invalid
		}

		for i, t := range todos { // Loop through the Todo items to find the one with the matching ID
			if t.ID == id {
				todos = append(todos[:i], todos[i+1:]...) // Remove the Todo item from the slice
				break
			}
		}

		return c.JSON(todos) // Return the updated Todo items as a JSON response
	})

	// Define a route to mark a Todo item as done
	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id") // Get the ID parameter from the URL
		if err != nil {
			return c.Status(401).SendString("Invalid id") // Return an error if the ID is invalid
		}

		for i, t := range todos { // Loop through the Todo items to find the one with the matching ID
			if t.ID == id {
				todos[i].Done = true // Set the Done flag of the Todo item to true
				break
			}
		}

		return c.JSON(todos) // Return the updated Todo items as a JSON response
	})

	// Define a route to mark a Todo item as undone
	app.Patch("/api/todos/:id/undone", func(c *fiber.Ctx) error { // Create a PATCH endpoint for marking a todo as not done
		id, err := c.ParamsInt("id") // Get the ID of the todo from the request params
		if err != nil {
			return c.Status(401).SendString("Invalid id") // Return an error if the ID is not a valid integer
		}

		for i, t := range todos { // Loop through the todos array to find the todo with the given ID
			if t.ID == id { // If the ID matches, mark the todo as not done
				todos[i].Done = false
				break // Stop looping once the todo is updated
			}
		}

		return c.JSON(todos) // Return the updated todos array as a JSON response
	})

	// Define a route to edit a Todo item by its ID
	app.Patch("/api/todos/:id/edit", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id") // Get the ID parameter from the URL
		if err != nil {
			return c.Status(401).SendString("Invalid id") // Return an error if the ID is invalid
		}

		todo := &Todo{}
		if err := c.BodyParser(todo); err != nil { // Parse the request body to get the updated Todo item
			return err // Return an error if parsing the request body fails
		}

		for i, t := range todos { // Loop through the Todo items to find the one with the matching ID
			if t.ID == id {
				todos[i].Title = todo.Title // Update the title of the Todo item
				todos[i].Body = todo.Body   // Update the body of the Todo item
				break
			}
		}

		return c.JSON(todos) // Return the updated Todo items as a JSON response
	})

	log.Fatal(app.Listen(":4000")) // Start the server and log any fatal errors
}
