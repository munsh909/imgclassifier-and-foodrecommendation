import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateRecipeEntry() {
  const [rating, setRating] = useState('');
  const [name, setName] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage('⚠️ You must be signed in to submit.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('your_table_name').insert([
      {
        user_id: user.id,
        rating,
        name: name || null,
        recipe_name: recipeName,
        image_url: imageUrl || null
      }
    ]);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Entry saved successfully!');
      setRating('');
      setName('');
      setRecipeName('');
      setImageUrl('');
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <div className="card p-4" style={{ backgroundColor: '#121914', color: 'white', borderColor: '#14532d' }}>
        <h2 className="mb-4 text-center" style={{ color: '#a5d6a7' }}>Log a Recipe Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Rating (e.g. 4.5)</label>
            <input
              className="form-control"
              type="number"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              style={{ backgroundColor: '#1e2a1e', color: 'white', borderColor: '#14532d' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Name (optional)</label>
            <input
              className="form-control"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ backgroundColor: '#1e2a1e', color: 'white', borderColor: '#14532d' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Recipe Name</label>
            <input
              className="form-control"
              type="text"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              required
              style={{ backgroundColor: '#1e2a1e', color: 'white', borderColor: '#14532d' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image URL (optional)</label>
            <input
              className="form-control"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{ backgroundColor: '#1e2a1e', color: 'white', borderColor: '#14532d' }}
            />
          </div>
          <button
            className="btn w-100"
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#14532d', color: 'white', border: 'none' }}
          >
            {loading ? 'Submitting...' : 'Save Entry'}
          </button>
        </form>
        {message && <div className="mt-3 text-center">{message}</div>}
      </div>
    </div>
  );
}