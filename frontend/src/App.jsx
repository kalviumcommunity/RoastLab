import { useState } from 'react';
import './index.css';

function App() {
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('selfie', image);
    formData.append('description', desc);

    try {
      const res = await fetch('http://localhost:3001/api/roast', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="layout">
      <section className="card">
        <h1 className="heading">Roast Me</h1>
        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Profile Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <div className="upload-area">
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            <label htmlFor="file-input" className="upload-box">
              {preview ? (
                <img src={preview} alt="preview" className="preview-img" />
              ) : (
                <span className="upload-text">+ Upload Image</span>
              )}
            </label>
          </div>

          <label className="label">
            Description
            <textarea
              value={desc}
              required
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe yourself..."
              rows={3}
            />
          </label>

          <button type="submit" disabled={loading || !desc || !image}>
            {loading ? 'Roasting...' : 'Get Roast'}
          </button>
        </form>

        {result && (
          <div className="result">
            <div>
              <strong>Roast:</strong>
              <div className="roast">
                {result.roast.split("\n\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
            <div>
              <strong>Compliment:</strong>
              <p className="compliment">{result.compliment}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
