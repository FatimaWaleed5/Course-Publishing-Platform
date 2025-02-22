import React, { useState, useEffect } from 'react';
import './ProfileForm.css';
import axios from 'axios';
import TrainerForm from '../TrainerForm/TrainerForm'; // استيراد نموذج المدرب

const ProfileForm = ({ handleRoleChange, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [dob, setDob] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showTrainerForm, setShowTrainerForm] = useState(false); 
  const [thankYouMessage, setThankYouMessage] = useState(false); 

  const handleImageUpload = (e) => setImage(URL.createObjectURL(e.target.files[0]));
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'M';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (role) {
      onSubmit(role);
      // إعادة تعيين الحقول
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setUsername('');
      setEmail('');
      setGender('');
      setCity('');
      setEducationLevel('');
      setLanguage('');
      setDob('');
      setRole('');
      setImage(null);
      setPassword('');
      setConfirmPassword('');
      setMessage('Profile updated successfully!');
    } else {
      setMessage('Please select a role');
    }
  };

  const handleRoleSelection = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    if (selectedRole === 'Trainer') {
      setShowTrainerForm(true);
      setThankYouMessage(false);
    } else if (selectedRole === 'Student') {
      setThankYouMessage(true);
      setShowTrainerForm(false);
    }
  };

  useEffect(() => {
    axios.get('/api/profile')
      .then((response) => {
        const data = response.data;
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhoneNumber(data.phoneNumber);
        setUsername(data.username);
        setEmail(data.email);
        setGender(data.gender);
        setCity(data.city);
        setEducationLevel(data.educationLevel);
        setLanguage(data.language);
        setDob(data.dob);
        setRole(data.role);
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      });
  }, []);

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'gender': setGender(value); break;
      case 'city': setCity(value); break;
      case 'educationLevel': setEducationLevel(value); break;
      case 'language': setLanguage(value); break;
      default: break;
    }
    axios.put('/api/profile', { [field]: value })
      .catch((error) => {
        console.error(`Error updating ${field}:`, error);
      });
  };

  return (
    <div className="profile-form">
      {!showTrainerForm && !thankYouMessage && (
        <>
          <div className="profile-pic">
            {image ? (
              <img src={image} alt="Profile" />
            ) : (
              <div className="placehold">
                <span className="initial">{getInitial(firstName)}</span>
              </div>
            )}
            <p className='yourname'>{firstName} {lastName}</p>
            <input type="file" onChange={handleImageUpload} />
          </div>

          <form onSubmit={handleSubmit} className="form-fields">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Gender</label>
              <select
                value={gender}
                onChange={(e) => handleFieldChange('gender', e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="label">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Education Level</label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => handleFieldChange('educationLevel', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => handleFieldChange('language', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Student or Trainer</label>
              <select
                value={role}
                onChange={handleRoleSelection}
                required
              >
                <option value="">Select</option>
                <option value="Student">Student</option>
                <option value="Trainer">Trainer</option>
              </select>
            </div>
            <button className='subinfo' type="submit">Submit</button>
          </form>
        </>
      )}

      {showTrainerForm && <div className="trainer-form"><TrainerForm /></div>} 
      {thankYouMessage && <div className="success-message">
        Thank you, your information has been received successfully.</div>} 

      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default ProfileForm;
