import type { Todo } from 'common/types/todo';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './TodoDetail.module.css';

const TodoDetail = () => {
  const router = useRouter();
  const { todoId } = router.query; // URLからtodoIdを取得
  const [todo, setTodo] = useState<Todo | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (todoId) {
      fetchTodo();
    }
  }, [todoId]);

  const fetchTodo = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User ID is missing. Please log in again.');
      return;
    }

    try {
      const allTodos = await apiClient.todoList.todo.$get({
        headers: {
          'x-todo-user-id': userId,
        },
      });
      const specificTodo = allTodos.find((todo) => todo.id === Number(todoId));
      if (specificTodo) {
        setTodo(specificTodo);
        setNotes(specificTodo.notes || '');
      } else {
        setError('Todoが見つかりません');
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Todoの取得中にエラーが発生しました');
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const saveNotes = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User ID is missing. Please log in again.');
      return;
    }

    if (todo) {
      try {
        await apiClient.todoList.todo.$put({
          body: {
            id: todo.id,
            title: todo.title,
            notes,
          },
          headers: {
            'x-todo-user-id': userId,
          },
        });
        setError(null);
      } catch (error) {
        console.error('Error saving notes:', error);
        setError('メモの保存中にエラーが発生しました');
      }
    }
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!todo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{todo.title}</h1>
      <p className={styles.date}>
        作成日: {new Date(todo.createdAt).toLocaleDateString()}{' '}
        {new Date(todo.createdAt).toLocaleTimeString()}
      </p>
      <p className={styles.date}>
        更新日: {new Date(todo.updatedAt).toLocaleDateString()}{' '}
        {new Date(todo.updatedAt).toLocaleTimeString()}
      </p>
      <textarea className={styles.notes} value={notes} onChange={handleNotesChange} />
      <button onClick={saveNotes}>Save Notes</button>
    </div>
  );
};

export default TodoDetail;
