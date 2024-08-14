import type { Prisma } from '@prisma/client';
import type { Todo } from 'common/types/todo';

const getAllTodos = async (tx: Prisma.TransactionClient): Promise<Todo[]> => {
  try {
    return await tx.todo.findMany();
  } catch (error) {
    console.error('Error fetching todos from database:', error);
    throw new Error('Failed to fetch todos');
  }
};

const createTodo = async (
  tx: Prisma.TransactionClient,
  title: string,
  notes: string,
): Promise<Todo> => {
  try {
    return await tx.todo.create({
      data: {
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        notes,
      },
    });
  } catch (error) {
    console.error('Error creating todo in database:', error);
    throw new Error('Failed to create todo');
  }
};

const updateTodo = async (
  tx: Prisma.TransactionClient,
  id: number,
  notes: string,
  title: string,
): Promise<Todo | null> => {
  try {
    return await tx.todo.update({
      where: { id },
      data: {
        title,
        notes,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error updating todo in database:', error);
    throw new Error('Failed to update todo');
  }
};

const deleteTodo = async (tx: Prisma.TransactionClient, id: number): Promise<boolean> => {
  try {
    const result = await tx.todo.deleteMany({
      where: { id },
    });
    return result.count > 0;
  } catch (error) {
    console.error('Error deleting todo in database:', error);
    throw new Error('Failed to delete todo');
  }
};

const updateTodoNotes = async (
  tx: Prisma.TransactionClient,
  id: number,
  notes: string,
): Promise<Todo | null> => {
  try {
    return await tx.todo.update({
      where: { id },
      data: {
        notes,
      },
    });
  } catch (error) {
    console.error('Error updating todo description in database:', error);
    throw new Error('Failed to update todo description');
  }
};

export const todoQuery = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  updateTodoNotes,
};
