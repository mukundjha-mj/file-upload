import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    Alert,
    Box,
    Grid,
    IconButton,
    Tooltip,
    Fade,
    Zoom,
    Slide,
    CircularProgress
} from '@mui/material';
import {
    Upload as UploadIcon,
    Logout as LogOutIcon,
    Download as DownloadIcon,
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [downloadingFiles, setDownloadingFiles] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        // Redirect to login if no token
        if (!token) {
            navigate("/login");
            return;
        }
        fetchFiles();
    }, [token, navigate]);

    const fetchFiles = async () => {
        try {
            const response = await fetch("http://localhost:3000/files", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Unauthorized");
            }

            const data = await response.json();
            setFiles(data);
        } catch (error) {
            setError("Error fetching files. Please log in again.");
            logout();
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (event) => {
                const progress = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(progress);
            };

            await new Promise((resolve, reject) => {
                xhr.open("POST", "http://localhost:3000/upload");
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                        // Trigger success animation
                        setUploadSuccess(true);
                        setTimeout(() => {
                            setUploadSuccess(false);
                        }, 2000);
                    } else {
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = () => reject(xhr.statusText);
                xhr.send(formData);
            });

            setUploadProgress(0);
            setSelectedFile(null);
            fetchFiles();
        } catch (error) {
            setError("Error uploading file. Please try again.");
            setUploadProgress(0);
        }
    };

    const handleFileDelete = async (fileId) => {
        try {
            const response = await fetch(`http://localhost:3000/delete/${fileId}`, {
                method: 'DELETE',
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete file");
            }

            fetchFiles();
        } catch (error) {
            setError("Error deleting file. Please try again.");
        }
    };

    const handleFileDownload = async (fileId) => {    
        // Add the file to downloading state
        setDownloadingFiles(prev => [...prev, fileId]);

        try {
            const response = await fetch(`http://localhost:3000/download/${fileId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            const blob = await response.blob(); 
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Remove file from downloading state after download
            setTimeout(() => {
                setDownloadingFiles(prev => prev.filter(id => id !== fileId));
            }, 1000);
        } catch (error) {
            setError("Error downloading file. Please try again.");
            // Remove file from downloading state if error occurs
            setDownloadingFiles(prev => prev.filter(id => id !== fileId));
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Container 
            maxWidth="md" 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                py: 4
            }}
        >
            <Zoom in={true} timeout={500}>
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 3,
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
                    }}
                >
                    <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center" 
                        mb={3}
                    >
                        <Slide direction="right" in={true} timeout={500}>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    color: 'primary.main' 
                                }}
                            >
                                File Manager
                            </Typography>
                        </Slide>
                        <Tooltip title="Logout">
                            <Button
                                color="error"
                                variant="outlined"
                                startIcon={<LogOutIcon />}
                                onClick={logout}
                                sx={{ borderRadius: 2 }}
                            >
                                Logout
                            </Button>
                        </Tooltip>
                    </Box>
                    

                    {error && (
                        <Fade in={true} timeout={500}>
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 2,
                                    borderRadius: 2 
                                }}
                            >
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            mb: 3,
                            textAlign: 'center',
                            borderStyle: 'dashed',
                            borderRadius: 2
                        }}
                    >
                        <input
                            accept="*/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <label htmlFor="raised-button-file">
                            <Button
                                variant="outlined"
                                component="span"
                                startIcon={<CloudUploadIcon />}
                                sx={{ 
                                    mb: 2,
                                    borderRadius: 2 
                                }}
                            >
                                {selectedFile ? selectedFile.name : "Select File"}
                            </Button>
                        </label>

                        {uploadProgress > 0 && (
                            <Fade in={uploadProgress > 0} timeout={500}>
                                <Box sx={{ width: '100%', mb: 2 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={uploadProgress}
                                        sx={{ borderRadius: 2 }}
                                    />
                                    <Typography 
                                        variant="body2" 
                                        color="textSecondary" 
                                        sx={{ mt: 1 }}
                                    >
                                        Uploading... {uploadProgress}%
                                    </Typography>
                                </Box>
                            </Fade>
                        )}

                        {uploadSuccess && (
                            <Fade in={uploadSuccess} timeout={500}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    color: 'success.main',
                                    mb: 2
                                }}>
                                    <CheckCircleIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        File Uploaded Successfully!
                                    </Typography>
                                </Box>
                            </Fade>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ 
                                mt: 1,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none'
                            }}
                            startIcon={<UploadIcon />}
                            onClick={handleFileUpload}
                            disabled={!selectedFile || uploadProgress > 0}
                        >
                            Upload File
                        </Button>
                    </Paper>

                    <Typography 
                        variant="h6" 
                        sx={{ 
                            mb: 2,
                            fontWeight: 'bold' 
                        }}
                    >
                        Uploaded Files
                    </Typography>
                    {files.length === 0 ? (
                        <Fade in={true} timeout={500}>
                            <Typography 
                                variant="body2" 
                                color="textSecondary" 
                                align="center"
                            >
                                No files uploaded yet
                            </Typography>
                        </Fade>
                    ) : (
                        <List>
                            {files.map((file, index) => (
                                <Slide 
                                    direction="up" 
                                    in={true} 
                                    timeout={500 + index * 100}
                                    key={file._id}
                                >
                                    <ListItem
                                        secondaryAction={
                                            <Box>
                                                <Tooltip title="Download">
                                                    <IconButton 
                                                        color="primary"
                                                        onClick={() => handleFileDownload(file._id)}
                                                        disabled={downloadingFiles.includes(file._id)}
                                                    >
                                                        {downloadingFiles.includes(file._id) ? (
                                                            <CircularProgress size={24} />
                                                        ) : (
                                                            <DownloadIcon />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton 
                                                        color="error"
                                                        onClick={() => handleFileDelete(file._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                        sx={{ 
                                            borderBottom: '1px solid', 
                                            borderColor: 'divider' 
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {file.fileName}
                                                </Typography>
                                            }
                                            secondary={
                                                <Grid container spacing={1}>
                                                    <Grid item>
                                                        {formatFileSize(file.fileSize)}
                                                    </Grid>
                                                    <Grid item>
                                                        • {formatDate(file.uploadDate)}
                                                    </Grid>
                                                </Grid>
                                            }
                                        />
                                    </ListItem>
                                </Slide>
                            ))}
                        </List>
                    )}
                </Paper>
            </Zoom>
        </Container>
    );
};

export default Dashboard;