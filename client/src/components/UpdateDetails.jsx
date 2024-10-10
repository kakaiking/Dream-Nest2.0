import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { IoDocumentTextOutline } from "react-icons/io5";
import '../styles/UpdateDetails.scss'
import Loader from './Loader';
import DOMPurify from 'dompurify';
import CommentSection from '../components/CommentSection';




const UpdateDetails = () => {
  const [update, setUpdate] = useState(null);
  const { updateId } = useParams();

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const response = await fetch(`http://localhost:3001/updates/${updateId}`);
        const data = await response.json();
        setUpdate(data);
        console.log(data)
      } catch (err) {
        console.error("Failed to fetch update details", err);
      }
    };

    fetchUpdate();
  }, [updateId]);

  const timeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const differenceInMilliseconds = now - createdAt;

    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInHours < 24) {
      if (differenceInMinutes < 60) {
        return differenceInMinutes === 1 ? "1 minute ago" : `${differenceInMinutes} minutes ago`;
      } else {
        return differenceInHours === 1 ? "1 hour ago" : `${differenceInHours} hours ago`;
      }
    } else {
      return differenceInDays === 1 ? "1 day ago" : `${differenceInDays} days ago`;
    }
  };

  if (!update) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="update-details">
        <div className="updateTitle" style={{ textAlign: "center", margin: "20px auto" }}>
          <h1>{update.title}</h1>
        </div>

        <div className="vid">
          {update.videoLink ? (
            <ReactPlayer
              url={`${update.videoLink}?modestbranding=1&showinfo=0&rel=0`}
              style={{ margin: "30px auto", boxShadow: '0 3px 10px 2px rgba(0, 0, 50, 0.9)' }}
            />
          ) : (
            <div style={{
              height: "300px", /* Set the height similar to the video */
              backgroundColor: "red",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "20px",
              boxShadow: '0 3px 10px 2px rgba(0, 0, 50, 0.9)'
            }}>
              No video available
            </div>
          )}
        </div>

        <div className="updateDeets" style={{ width: "90%", height: "auto", backgroundColor: '#fff', margin: '0 auto', borderRadius: '10px', padding: '20px' }}>
          <div className="desctitle" style={{ width: '65%', margin: "0 auto 20px auto", textAlign: "center" }}>
            <h3><u>Description:</u></h3>
            <p>Created: {timeAgo(update.createdAt)}</p> {/* Here we use the timeAgo function */}

          </div>

          <div className="updateP" style={{ width: '85%', height: "auto", margin: "30px auto" }}>
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(update.description)}} />
          </div><br /><hr />


          <div className="supportDocs">
            <div className="supportTitle" style={{ width: '65%', margin: "0 auto 20px auto", textAlign: "center" }}>
              <h3><u>Supporting Documents:</u></h3>
            </div>
            {update.supportingDocuments && update.supportingDocuments.length > 0 ? (
              <div className="doc-cards">
                {update.supportingDocuments.map((doc, index) => (
                  <div className="doc-card" key={index}>
                    <a href={`http://localhost:3001/uploads/${doc.fileUrl}`} target="_blank" rel="noopener noreferrer">
                      <div className="doc-icon">
                        <IoDocumentTextOutline />
                      </div>
                      <div className="doc-name">
                        {doc.fileName}
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>No supporting documents available.</p>
            )}
          </div>
        </div>

        <div className="comment-section">
          <div className="comment-sectionn">
            <CommentSection updateId={updateId} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateDetails;