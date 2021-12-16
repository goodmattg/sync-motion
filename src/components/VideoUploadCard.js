import * as React from 'react';
import { styled } from '@mui/material/styles';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { CardMedia } from '@mui/material';

const Input = styled('input')({
    display: 'none',
});

const VideoUploadCard = (props) => {

    const [selectedFile, setSelectedFile] = React.useState();
    const [selectedFileURL, setSelectedFileURL] = React.useState();
    const [isSelected, setIsSelected] = React.useState(false);

    const changeHandler = (e) => {
        let file = e.target.files[0];
        setSelectedFile(file);
        setSelectedFileURL(URL.createObjectURL(file));
        setIsSelected(true);
        // console.log(file);
        // console.log(URL.createObjectURL(file));
    }

    const handleSubmission = (e) => {
        console.log("HERE");
    };

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                {isSelected ? (
                    <div>
                        <CardMedia autoPlay loop muted component="video" src={selectedFileURL}></CardMedia>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Filename: {selectedFile.name}
                            Filetype: {selectedFile.type}
                            Size in bytes: {selectedFile.size}
                            lastModifiedDate:{' '}
                            {selectedFile.lastModifiedDate.toLocaleDateString()}
                        </Typography >
                    </div >
                ) : (
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Upload your video
                    </Typography>
                )
                }
                <label htmlFor={`contained-button-file-${props.id}`}>
                    <Input accept="video/*" id={`contained-button-file-${props.id}`} type="file" onChange={changeHandler} />
                    <Button variant="contained" component="span" onClick={handleSubmission}>
                        Upload
                    </Button>
                </label>
                <label htmlFor={`icon-button-file-${props.id}`}>
                    <Input accept="video/*" id={`icon-button-file-${props.id}`} type="file" />
                    <IconButton color="primary" aria-label="upload video" component="span">
                        <PhotoCamera />
                    </IconButton>
                </label>

            </CardContent >
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card >
    );
}
export default VideoUploadCard;

{/* <video controls autoPlay loop muted srcObject={selectedFileURL}>
                            {/* <source src={selectedFileURL} type="video/mp4"></source> */}
{/* </video> */ }