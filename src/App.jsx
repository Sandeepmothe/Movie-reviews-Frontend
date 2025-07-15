import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = `https://movie-reviews-production-bd79.up.railway.app/api/reviews`;

function App() {
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState("");
  const [review, setReview] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchReviews = async () => {
    const res = await axios.get(API_URL);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, { movie, review });
      setEditingId(null);
    } else {
      await axios.post(API_URL, { movie, review });
    }
    setMovie("");
    setReview("");
    fetchReviews();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchReviews();
  };

  const handleEdit = (r) => {
    setMovie(r.movie);
    setReview(r.review);
    setEditingId(r.id);
  };

  return (
    <div style={{ padding: "20px" }} className='mainContainer'>
      <h2>🎬 Movie Review App</h2>
      <form onSubmit={handleSubmit} className='inputContainer'>
        <input
          type="text"
          placeholder="Movie Name"
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Update" : "Post"}</button>
      </form>

      <ul className='box-list'>
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.movie}:</strong> {r.review}
            <div>
              <button onClick={() => handleEdit(r)}>Edit</button>
              <button onClick={() => handleDelete(r.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

