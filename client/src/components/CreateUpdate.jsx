import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS for Quill toolbar styling

import "../styles/CreateUpdate.scss"

const CreateUpdate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');  // Should be a string
  const [videoLink, setVideoLink] = useState('');
  const [supportingDocs, setSupportingDocs] = useState([]);
  const { listingId } = useParams();
  const navigate = useNavigate();

  const token = useSelector((state) => state.token);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('You can only upload a maximum of 5 files.');
      return;
    }
    setSupportingDocs(files);
  };

  const handleChangeRichText = (content) => {
    setDescription(content);  // Update directly as a string
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('listingId', listingId);
    formData.append('title', title);
    formData.append('description', description);  // Ensure this is a string
    formData.append('videoLink', videoLink);
    supportingDocs.forEach((file) => {
      formData.append('supportingDocuments', file);
    });

    try {
      const response = await fetch('http://localhost:3001/updates/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate(`/`);
      } else {
        const errorData = await response.json();
        console.error('Failed to create update:', errorData.message);
        alert('Failed to create update. Please try again.');
      }
    } catch (err) {
      console.error('Error creating update', err);
      alert('An error occurred. Please try again.');
    }
  };

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
  ];

  return (
    <>
      <Navbar />
      <div className="create-update">
        <h1>Create Update</h1>
        <form onSubmit={handleSubmit}>
          <div className="all">
            <div className="individualAll">
              <p>What is The Title For this Exciting Update?</p>
              <input
                type="text"
                placeholder="Update Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="individualAll">
              <p>What is The Link To The Youtube Video Related To This Update?</p>
              <input
                type="url"
                placeholder="YouTube Video Link"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                required
              />
            </div>

            <div className="individualAll">
              <p>Explain To Your Investors The Details Of This New Update:</p>
              <ReactQuill
                value={description}
                onChange={handleChangeRichText}
                modules={modules}
                formats={formats}
                style={{ height: "300px" }}
              />
            </div>

            <div className="individualAll">
              <p>Submit Any Relevant Document To Back this Update</p>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx"
              />
            </div>

          </div>
          <div className="formButton">
            <div className="formButtonn">
              <button type="submit">Create Update</button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CreateUpdate;