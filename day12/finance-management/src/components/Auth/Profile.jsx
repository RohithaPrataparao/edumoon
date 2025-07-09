import React, { useState } from 'react';

const getUser = () => JSON.parse(localStorage.getItem('financeapp_user')) || {};
const saveUser = (user) => localStorage.setItem('financeapp_user', JSON.stringify(user));

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(getUser());
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    photo: user.photo || ''
  });
  const [preview, setPreview] = useState(form.photo);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photoFile' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(f => ({ ...f, photo: ev.target.result }));
        setPreview(ev.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm(f => ({ ...f, [name]: value }));
      if (name === 'photo') setPreview(value);
    }
  };

  const handleSave = e => {
    e.preventDefault();
    setUser(form);
    saveUser(form);
    setEdit(false);
  };

  return (
    <div className="neu-card mx-auto mt-4" style={{ maxWidth: 400 }}>
      <h2 className="text-center mb-4">Profile</h2>
      {!edit ? (
        <div className="text-center">
          <img
            src={user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User') + '&background=eee&color=555&size=128'}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: 96, height: 96, objectFit: 'cover', boxShadow: '0 2px 8px #d1d9e6' }}
          />
          <h4>{user.name}</h4>
          <p className="mb-2 text-muted">{user.email}</p>
          <button className="neu-btn btn btn-primary mt-2" onClick={() => setEdit(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="text-center">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control neu-input" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control neu-input" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Photo</label>
            <input type="url" className="form-control neu-input mb-2" name="photo" value={form.photo} onChange={handleChange} placeholder="Paste image URL or leave blank for default" />
            <div>or</div>
            <input type="file" accept="image/*" className="form-control neu-input" name="photoFile" onChange={handleChange} />
            {preview && (
              <img src={preview} alt="Preview" className="rounded-circle mt-2" style={{ width: 64, height: 64, objectFit: 'cover', boxShadow: '0 2px 8px #d1d9e6' }} />
            )}
          </div>
          <button type="submit" className="neu-btn btn btn-success me-2">Save</button>
          <button type="button" className="neu-btn btn btn-secondary" onClick={() => setEdit(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
