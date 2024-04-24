import ReactDOM from "react-dom/client";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import "./index.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  // const [todoId, setTodoId] = useState(todos.length + 1);
  const [isEditable, setIsEditable] = useState(false);
  const [editId, setEditId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("notStarted");
  const [filteredTodos, setFilteredTodos] = useState([]);

  const [todoList, setTodoList] = useState([]);

  const handleAddFormChanges = (e) => {
    setTodoTitle(e.target.value);
  };

  const resetFormInput = () => {
    setTodoTitle("");
  };

  const handleAddTodo = async () => {
    await addDoc(collection(db, "todos"), {
      id: crypto.randomUUID(),
      title: todoTitle,
      status: "notStarted",
    });
    const data = await getDocs(collection(db, "todos"));
    setTodoList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // setTodoId(todoId + 1);
    resetFormInput();
  };

  const handleDeleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    const data = await getDocs(collection(db, "todos"));
    setTodoList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // setTodoList(todoList.filter((todo) => todo !== targetTodo));
  };

  const handleOpenEditForm = (todo) => {
    setIsEditable(true);
    setEditId(todo.id);
    setNewTitle(todo.title);
  };

  const handleEditFormChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleCloseEditForm = () => {
    setIsEditable(false);
    setEditId("");
  };

  const handleEditTodo = async (id) => {
    const newArray = todoList.map((todo) =>
      todo.id === editId ? { ...todo, title: newTitle } : todo
    );

    await updateDoc(doc(db, "todos", editId), {
      title: newTitle,
    });

    setTodoList(newArray);
    setNewTitle("");
    setEditId();
    handleCloseEditForm();
  };

  const handleStatusChange = async (targetTodo, e) => {
    const newArray = todoList.map((todo) =>
      todo.id === targetTodo.id ? { ...todo, status: e.target.value } : todo
    );
    await updateDoc(doc(db, "todos", targetTodo.id), {
      status: e.target.value,
    });
    setTodoList(newArray);
  };

  useEffect(() => {
    const getTodos = async () => {
      const data = await getDocs(collection(db, "todos"));
      setTodoList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getTodos();
    console.log("success");
  }, []);

  useEffect(() => {
    const filteringTodos = () => {
      switch (filter) {
        case "notStarted":
          setFilteredTodos(
            todoList.filter((todo) => todo.status === "notStarted")
          );
          break;
        case "inProgress":
          setFilteredTodos(
            todoList.filter((todo) => todo.status === "inProgress")
          );
          break;
        case "done":
          setFilteredTodos(todoList.filter((todo) => todo.status === "done"));
          break;
        default:
          setFilteredTodos(todoList);
      }
    };
    filteringTodos();
    console.log("success");
  }, [filter, todoList]);

  return (
    <>
      {isEditable ? (
        <div className="input-area">
          <input
            type="text"
            label="新しいタイトル"
            value={newTitle}
            onChange={handleEditFormChange}
          />
          <button onClick={handleEditTodo}>編集を保存</button>
          <button onClick={handleCloseEditForm}>キャンセル</button>
        </div>
      ) : (
        <div className="input-area">
          <input
            type="text"
            label="タイトル"
            value={todoTitle}
            onChange={handleAddFormChanges}
          />
          <button onClick={handleAddTodo}>作成</button>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">すべて</option>
            <option value="notStarted">未着手</option>
            <option value="inProgress">作業中</option>
            <option value="done">完了</option>
          </select>
        </div>
      )}

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <select
              value={todo.status}
              onChange={(e) => handleStatusChange(todo, e)}
            >
              <option value="notStarted">未着手</option>
              <option value="inProgress">作業中</option>
              <option value="done">完了</option>
            </select>
            <button onClick={() => handleOpenEditForm(todo)}>編集</button>
            <button onClick={() => handleDeleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
