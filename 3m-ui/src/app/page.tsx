"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [notes, setNotes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err.message);
      }
    };

    fetchPosts();
  }, []);

  // Fetch details for a selected post
  const fetchPostDetails = async (postId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/posts/${postId}`);
      setSelectedPost(response.data);

      // Set notes and reviews for the post
      setNotes(response.data.notes || []);
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error('Error fetching post details:', err.message);
    }
  };

  // Submit a new post
  const createPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/posts', {
        title,
        content,
        author,
      });

      setPosts((prevPosts) => [...prevPosts, response.data.post]);
      setNotes(response.data.notes || []);
      setReviews(response.data.reviews || []);
      setTitle('');
      setContent('');
      setAuthor('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  // Fetch ratings for notes
  const fetchRatings = async (noteId) => {
    try {
      const noteRatings = await axios.get(`http://127.0.0.1:8000/ratings?noteId=${noteId}`);
      setRatings((prevRatings) => ({
        ...prevRatings,
        [noteId]: noteRatings.data,
      }));
    } catch (err) {
      console.error('Error fetching ratings:', err.message);
    }
  };

  // Submit a rating for a note
  const submitRating = async (noteId, score) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/ratings', {
        noteId,
        score,
      });

      // Update ratings locally
      fetchRatings(noteId);
      console.log('Rating submitted:', response.data);
    } catch (err) {
      console.error('Error submitting rating:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 text-gray-800">
      <main className="flex flex-col lg:flex-row gap-10 w-full max-w-7xl">
        {/* Left Panel: Post Creation */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Multimodal Moderator</h1>
          <form onSubmit={createPost} className="flex flex-col gap-5 w-full">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </form>

          {error && <div className="text-red-600 mt-4">{error}</div>}

          {/* Posts List */}
          <h2 className="text-xl font-semibold mt-8">Posts</h2>
          <ul className="bg-gray-100 p-4 rounded-lg">
            {posts.map((post) => (
              <li
                key={post.id}
                className="cursor-pointer hover:text-blue-600"
                onClick={() => fetchPostDetails(post.id)}
              >
                {post.title} by {post.author}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel: Post Details */}
        <div className="flex flex-col gap-6 w-full lg:w-2/3 bg-gray-100 p-6 rounded-lg border shadow-md">
          {selectedPost ? (
            <>
              <h2 className="text-xl font-bold">{selectedPost.title}</h2>
              <p className="text-gray-700">{selectedPost.content}</p>
              <h3 className="text-lg font-semibold mt-6">Notes</h3>
              <ul className="bg-white p-4 rounded-lg border">
                {notes.map((note) => (
                  <li key={note.noteId}>
                    <strong>{note.noteAuthorParticipantId}:</strong> {note.summary}
                    <div className="mt-2">
                      <button
                        onClick={() => submitRating(note.noteId, 1)}
                        className="bg-green-600 text-white px-2 py-1 rounded-md mr-2"
                      >
                        Correct
                      </button>
                      <button
                        onClick={() => submitRating(note.noteId, 0)}
                        className="bg-yellow-600 text-white px-2 py-1 rounded-md mr-2"
                      >
                        Mixed
                      </button>
                      <button
                        onClick={() => submitRating(note.noteId, -1)}
                        className="bg-red-600 text-white px-2 py-1 rounded-md"
                      >
                        Incorrect
                      </button>
                    </div>
                    {/* Display Ratings */}
                    <div className="text-gray-600 text-sm mt-2">
                      Score: {ratings[note.noteId]?.score || 0}
                    </div>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mt-6">Reviews</h3>
              <ul className="bg-white p-4 rounded-lg border">
                {reviews.map((review) => (
                  <li key={review.id}>
                    <strong>{review.reviewerId}:</strong> {review.reviewComment}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Select a post to view details.</p>
          )}
        </div>
      </main>
    </div>
  );
}
