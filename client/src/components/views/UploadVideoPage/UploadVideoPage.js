import React, { useState } from 'react';
import { Typography, Button, Form, Input } from 'antd';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
];

const Category = [
    { value: 0, label: 'Film & Animation' },
    { value: 1, label: 'Autos & Vehicles' },
    { value: 2, label: 'Music' },
    { value: 3, label: 'Pets & Animals' },
    { value: 4, label: 'Sports' }
];

function UploadVideoPage(props) {
    const user = useSelector(state => state.user);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState(0);
    const [categories, setCategories] = useState("Film & Animation");
    const [filePath, setFilePath] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const handleChangeTitle = event => setTitle(event.currentTarget.value);
    const handleChangeDescription = event => setDescription(event.currentTarget.value);
    const handleChangePrivacy = event => setPrivacy(event.currentTarget.value);
    const handleChangeCategories = event => setCategories(event.currentTarget.value);

    const onSubmit = event => {
        event.preventDefault();
        if (!title || !description || !categories || !filePath || !thumbnail) {
            return alert("Fill in all fields before submitting!");
        }

        const variables = {
            writer: user.userData._id,
            title,
            description,
            privacy,
            filePath,
            category: categories,
            thumbnail
        };

        axios.post('/api/video/uploadVideo', variables).then(response => {
            if (response.data.success) {
                alert("Video uploaded successfully!");
                props.history.push("/");
            } else {
                alert("Failed to upload video");
            }
        });
    };

    const onDrop = files => {
        let formData = new FormData();
        const config = { header: { 'content-type': 'multipart/form-data' } };

        formData.append('file', files[0]);
        axios.post('/api/video/uploadfiles', formData, config).then(response => {
            if (response.data.success) {
                setFilePath(response.data.filePath);
                axios.post('/api/video/thumbnail', { filePath: response.data.filePath }).then(response => {
                    if (response.data.success) {
                        setThumbnail(response.data.thumbsFilePath);
                    } else {
                        alert("Failed to create the thumbnail");
                    }
                });
            } else {
                alert("Video failed to save on the server");
            }
        });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '20px', border: '2px solid #258dfc', backgroundColor: '#121212', borderRadius: '10px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} style={{ color: '#258dfc' }}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: '60%',  // MÁS ESTRECHO
                                    height: '200px',  // Ajustado
                                    border: '2px solid #258dfc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                {thumbnail ? (
                                    <img src={`http://localhost:5000/${thumbnail}`} alt="thumbnail"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            position: 'absolute',
                                            objectFit: 'contain'
                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: '3rem', color: '#258dfc' }}>+</span>
                                )}
                            </div>
                        )}
                    </Dropzone>
                </div>

                <label style={{ color: '#b3b3b3' }}>Title</label>
                <Input
                    placeholder="Ingrese el título del video"
                    onChange={handleChangeTitle}
                    value={title}
                    style={{ marginBottom: '20px', border: '1px solid #258dfc', backgroundColor: '#1e1e1e', color: 'white' }}
                />

                <label style={{ color: '#b3b3b3' }}>Description</label>
                <TextArea
                    placeholder="Ingrese una descripción del video"
                    onChange={handleChangeDescription}
                    value={description}
                    style={{ marginBottom: '20px', border: '1px solid #258dfc', backgroundColor: '#1e1e1e', color: 'white' }}
                />

                <label style={{ color: '#b3b3b3' }}>Privacy Level</label>
                <select
                    onChange={handleChangePrivacy}
                    style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #258dfc', backgroundColor: '#1e1e1e', color: 'white' }}
                >
                    {Private.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <label style={{ color: '#b3b3b3' }}>Category</label>
                <select
                    onChange={handleChangeCategories}
                    style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #258dfc', backgroundColor: '#1e1e1e', color: 'white' }}
                >
                    {Category.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
                </select>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button 
                        type="primary" 
                        size="large" 
                        onClick={onSubmit} 
                        style={{ width: '50%', backgroundColor: '#258dfc', border: 'none' }} // MÁS ESTRECHO
                    >
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default UploadVideoPage;
