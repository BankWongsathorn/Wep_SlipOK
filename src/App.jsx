import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Container} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [slipData, setslipData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if(file){
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      }
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('files', selectedFile);

    try{
      const response = await fetch('http://localhost:5000/slipok',{
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json();
        setslipData(data);
        alert('Slip uploaded successful ')
        console.log('response:', data)
      } else {
        alert('Failed to upload slip, Pease try again.')
      }
    } catch(error){
      console.error('Error:', error);
      alert('An error occurred while updating slip.')
    }
  }
  
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SlipOK
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
    <Container maxWidth="sm" sx={{margintop: 2}}>
      <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
      <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file"  accept= 'image/*'
      onChange={handleFileChange}/>
    </Button>
    { imageUrl !== '' &&
    <img src={imageUrl} alt="Preview" height={350} width={300}/>
  }
  { slipData &&
  <Box>
  <CheckIcon/>  
  <Typography variant="body1" gutterBottom>
    Sending Bank:{slipData?.data?.sendingBank}
  </Typography>
  <Typography variant="body1" gutterBottom>
    Sender:{slipData?.data?.sender?.displayName}
  </Typography>
  <Typography variant="body1" gutterBottom>
    Receiving Bank:{slipData?.data?.receivingBank}
  </Typography>
  <Typography variant="body1" gutterBottom>
    Receiver:{slipData?.data?.receiver?.displayName}
  </Typography>
  <Typography variant="body1" gutterBottom>
    Sending Amount:{slipData?.data?.amount}
  </Typography>
  </Box>
  }
        <Button type='submit' variant="contained">
          Upload Slip
          </Button>
          </Stack>
      </form>
      </Container>
    </div>
  )
}
