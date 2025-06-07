const fastify = require('fastify')({ logger: true });

// In-memory storage for todos
let todos = [];

// Routes

// Get all todos
fastify.get('/todos', async (request, reply) => {
  return todos;
});

// Add a new todo
fastify.post('/todos', async (request, reply) => {
  const { title } = request.body;
  if (!title) {
    reply.status(400).send({ error: 'Title is required' });
    return;
  }
  const newTodo = { id: todos.length + 1, title, completed: false };
  todos.push(newTodo);
  reply.status(201).send(newTodo);
});

// Update a todo
fastify.put('/todos/:id', async (request, reply) => {
  const { id } = request.params;
  const { title, completed } = request.body;
  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) {
    reply.status(404).send({ error: 'Todo not found' });
    return;
  }
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;
  reply.send(todo);
});

// Delete a todo
fastify.delete('/todos/:id', async (request, reply) => {
  const { id } = request.params;
  const index = todos.findIndex((t) => t.id === parseInt(id));
  if (index === -1) {
    reply.status(404).send({ error: 'Todo not found' });
    return;
  }
  todos.splice(index, 1);
  reply.status(204).send();
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();