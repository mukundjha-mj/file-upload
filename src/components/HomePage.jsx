import React from 'react';
import { 
    Container, 
    Typography, 
    Button, 
    Grid, 
    Paper, 
    Box,
    Card,
    CardContent,
    CardActions,
    Fade
} from '@mui/material';
import { 
    CloudUpload as CloudUploadIcon,
    Security as SecurityIcon,
    ShareOutlined as ShareIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <CloudUploadIcon fontSize="large" color="primary" />,
            title: "Easy File Upload",
            description: "Seamlessly upload and manage your files with our intuitive interface."
        },
        {
            icon: <SecurityIcon fontSize="large" color="primary" />,
            title: "Secure Storage",
            description: "Your files are protected with advanced encryption and secure cloud storage."
        },
        {
            icon: <ShareIcon fontSize="large" color="primary" />,
            title: "Easy Sharing",
            description: "Share your files quickly and securely with just a few clicks."
        }
    ];

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    return (
        <Container 
            maxWidth="lg"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Grid container spacing={4} alignItems="center">
                {/* Left Side - Hero Content */}
                <Grid item xs={12} md={6}>
                    <Fade in={true} timeout={1000}>
                        <Box>
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    fontWeight: 'bold', 
                                    mb: 2,
                                    color: 'primary.main'
                                }}
                            >
                                Secure File Management
                            </Typography>
                            <Typography 
                                variant="h6" 
                                color="text.secondary" 
                                sx={{ mb: 3 }}
                            >
                                Store, manage, and share your files with ease and confidence.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    size="large"
                                    onClick={handleLogin}
                                    sx={{ 
                                        px: 4, 
                                        py: 1.5, 
                                        borderRadius: 2 
                                    }}
                                >
                                    Login
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="primary"
                                    size="large"
                                    onClick={handleSignup}
                                    sx={{ 
                                        px: 4, 
                                        py: 1.5, 
                                        borderRadius: 2 
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Grid>

                {/* Right Side - Features */}
                <Grid item xs={12} md={6}>
                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} key={feature.title}>
                                <Fade 
                                    in={true} 
                                    timeout={1000} 
                                    style={{ transitionDelay: `${index * 300}ms` }}
                                >
                                    <Card 
                                        elevation={4} 
                                        sx={{ 
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            borderRadius: 3
                                        }}
                                    >
                                        <CardContent sx={{ 
                                            flexGrow: 1, 
                                            textAlign: 'center',
                                            pt: 4,
                                            pb: 2
                                        }}>
                                            {feature.icon}
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    mt: 2, 
                                                    mb: 1,
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                            >
                                                {feature.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HomePage;