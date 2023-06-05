import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [postIdToEdit, setPostIdToEdit] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (editMode) {
      const postToEdit = posts.find((post) => post.id === postIdToEdit);
      if (postToEdit) {
        setTitle(postToEdit.title);
        setBody(postToEdit.body);
      }
    } else {
      setTitle('');
      setBody('');
    }
  }, [editMode, postIdToEdit, posts]);

  useEffect(() => {
    if (editMode) {
      document.title = 'Editar Postagem';
    } else {
      document.title = 'CRUD de Postagens';
    }
  }, [editMode]);

  useEffect(() => {
    if (postIdToEdit === null) {
      setEditMode(false);
    }
  }, [postIdToEdit]);

  useEffect(() => {
    if (editMode === false && postIdToEdit === null) {
      fetchPosts();
    }
  }, [editMode, postIdToEdit]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addPost = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await axios.put(`http://localhost:8000/posts/${postIdToEdit}`, {
          title,
          body,
        });

        setEditMode(false);
        setPostIdToEdit(null);
      } else {
        const response = await axios.post('http://localhost:8000/posts', {
          title,
          body,
        });

        setPosts([...posts, response.data]);
      }

      setTitle('');
      setBody('');
    } catch (error) {
      console.error(error);
    }
  };

  const editPost = (id) => {
    const postToEdit = posts.find((post) => post.id === id);
    if (postToEdit) {
      setTitle(postToEdit.title);
      setBody(postToEdit.body);
      setEditMode(true);
      setPostIdToEdit(postToEdit.id);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>CRUD de Postagens</h1>

      <form onSubmit={addPost}>
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Conteúdo:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          {editMode ? 'Editar Postagem' : 'Adicionar Postagem'}
        </button>
      </form>

      <h2>Lista de Postagens</h2>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-list-item">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <div>
              <button onClick={() => editPost(post.id)}>Editar</button>
              <button onClick={() => deletePost(post.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
