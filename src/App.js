import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Page from './Component/Page';

const PeopleDirectory = () => {
  const [users, setUsers] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user list:', error));
  }, []);

  return (
    <div>
      <h1 className='text-center mt-5 mb-5'>Directory</h1>
      <div>
        {users.map(user => (
          <div className='d-flex justify-content-center' key={user.id} onClick={() => handleCardClick(user.id)}>
            <Card className='mb-3' style={{ width: '28rem' }}>
              <Card.Body>
                <Card.Title>
                  <div className='d-flex justify-content-between'>
                    <div className='float-start'>Name: {user.name}</div>
                    <div className='float-end'>Posts: {getTotalPosts(user.id)}</div>
                  </div>
                </Card.Title>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      {selectedPost && (
        <Page post={selectedPost} show={showPopup} handleClose={handlePopupClose} />
      )}
    </div>
  );
};

const handleCardClick = (userId) => {
  
  console.log(`Card clicked for user ID: ${userId}`);
  
};

const getTotalPosts = (userId) => {
  
  
  return 5;
};

export default PeopleDirectory;
