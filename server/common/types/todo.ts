export type Todo = {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
  todoUser: {
    id: number;
    name: string;
  };
  todoUserId: number;
};
