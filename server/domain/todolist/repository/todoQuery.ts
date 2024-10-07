import type { Prisma } from '@prisma/client';
import type { Todo } from 'common/types/todo';

const getAllTodos = async (tx: Prisma.TransactionClient, todoUserId: number): Promise<Todo[]> => {
  try {
    return await tx.todo.findMany({
      where: { todoUserId },
      include: { todoUser: true },
    });
  } catch (error) {
    console.error('Error fetching todos from database:', error);
    throw new Error('Failed to fetch todos');
  }
};

const createTodo = async (
  tx: Prisma.TransactionClient,
  title: string,
  notes: string,
  todoUserId: number,
): Promise<Todo> => {
  try {
    const newtodo = await tx.todo.create({
      data: {
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes,
        todoUserId,
      },
    });

    const completeTodo = await tx.todo.findUnique({
      where: { id: newtodo.id },
      include: { todoUser: true },
    });

    if (!completeTodo) {
      throw new Error('Failed to retrieve the created todo with user information.');
    }

    return completeTodo;
  } catch (error) {
    console.error('Error creating todo in database:', error);
    throw new Error('Failed to create todo');
  }
};

const updateTodo = async (
  tx: Prisma.TransactionClient,
  id: number,
  title: string,
  notes: string,
): Promise<Todo | null> => {
  try {
    return await tx.todo.update({
      where: { id },
      data: {
        title,
        notes,
        updatedAt: new Date(),
      },
      include: { todoUser: true },
    });
  } catch (error) {
    console.error('Error updating todo in database:', error);
    throw new Error('Failed to update todo');
  }
};

const deleteTodo = async (tx: Prisma.TransactionClient, id: number): Promise<boolean> => {
  try {
    await tx.todo.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting todo in database:', error);
    throw new Error('Failed to delete todo');
  }
};

export const todoQuery = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
