import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Page = (props) => {
    const [clockTime, setClockTime] = useState(0);
    const [clockRunning, setClockRunning] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        
        fetch('https://jsonplaceholder.typicode.com/posts')
          .then(response => response.json())
          .then(data => {
            const postsByUser = {};
            const limitedPosts = [];
            
            data.forEach(post => {
              const userId = post.userId;
              if (!postsByUser[userId]) {
                postsByUser[userId] = 1;
                limitedPosts.push(post);
              } else if (postsByUser[userId] < 3) {
                postsByUser[userId]++;
                limitedPosts.push(post);
              }
            });
      
            setPosts(limitedPosts);
          })
          .catch(error => console.error('Error fetching posts:', error));
      }, []);
      

    useEffect(() => {
        fetchUserDetails(); // Fetch user details when the component mounts
        // Retrieve clock time from local storage
        const storedClockTime = localStorage.getItem('clockTime');
        setClockTime(storedClockTime ? parseInt(storedClockTime) : 0);

        const intervalId = setInterval(() => {
            if (clockRunning) {
                setClockTime((prevTime) => prevTime + 1);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [clockRunning]);

    const toggleClock = () => {
        setClockRunning((prevRunning) => !prevRunning);
    };

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            setUserDetails(data[0]);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`;
    };

    const numberStyle = {
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: '#001F3F', // Dark blue background
        color: '#FFFFFF', // White text
        padding: '5px 5px',
        borderRadius: '5px',
        margin: '0 5px',
    };

    return (
        <div>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Back
                    </Button>
                    <div className="mx-auto">
                        Country Dropdown
                    </div>
                    <div className='mx-auto'>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {formatTime(clockTime)
                                .split(':')
                                .map((number, index) => (
                                    <div key={index} style={numberStyle}>
                                        {number}
                                    </div>
                                ))}
                        </div>
                    </div>
                    <button onClick={toggleClock} className='float-start'>
                        {clockRunning ? 'Pause/Start' : 'Start'}
                    </button>
                    <Modal.Title>{props.post.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h5 className='text-center'>Profile Page</h5>
                        {userDetails && (
                            <div className='mx-auto'>
                                <Card className='mx-auto' style={{ width: '18rem' }}>
                                    <Card.Body>
                                        <Card.Title>{userDetails.name}</Card.Title>
                                        <Card.Text className='float-start'>
                                            {userDetails.username} | {userDetails.company.catchPhrase}
                                        </Card.Text>
                                        <Card.Text className='text-end'>
                                            {userDetails.address.street}
                                            <br />
                                            {userDetails.email} | {userDetails.phone}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <div className='Posts mt-5'>
                                    <Row>
                                        <Col>
                                            <Card className='mx-auto' style={{ width: '18rem' }}>
                                                <Card.Body>
                                                    {
                                                        posts.map(post => (
                                                            <>
                                                                <li key={post.id}>
                                                                    {post.title}
                                                                </li>
                                                            </>
                                                        ))
                                                    }
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Page;
