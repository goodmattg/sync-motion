import * as React from 'react'
import { styled } from '@mui/material/styles'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { CardMedia } from '@mui/material'

import * as MP4Box from '../mp4box.all'

const Input = styled('input')({
    display: 'none',
})

class VideoUploadCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedFile: null,
            selectedFileURL: null,
            isSelected: false,
            videoFrames: [],
            videoKeypoints: [],
        }
    }

    onResults = (results) => {
        if (results.poseLandmarks) {
            this.setState((prevState) => ({
                videoKeypoints: [
                    ...prevState.videoKeypoints,
                    results.poseLandmarks,
                ],
            }))
            console.log(this.state.videoKeypoints.length)
            // videoKeypoints.current.push(results.poseLandmarks)
        }
    }

    async componentDidUpdate() {
        if (this.state.selectedFileURL) {
            var mp4box = MP4Box.createFile()
            let blob = await fetch(this.state.selectedFileURL).then((r) =>
                r.blob()
            )
            let buffer = await blob.arrayBuffer()
            buffer.fileStart = 0
            mp4box.onError = function (e) {}
            mp4box.onReady = function (info) {
                console.log(info)
            }
            mp4box.appendBuffer(buffer)
        }
    }

    changeHandler = (e) => {
        let file = e.target.files[0]
        this.setState((_) => ({
            selectedFile: file,
            selectedFileURL: URL.createObjectURL(file),
            isSelected: true,
        }))
    }

    handleSubmission = (e) => {
        // console.log('HERE')
    }

    render() {
        return (
            <div>
                <Card id={`${this.props.id}-card`} sx={{ minWidth: 275 }}>
                    <CardContent>
                        {this.state.isSelected ? (
                            <div>
                                <CardMedia
                                    autoPlay
                                    loop
                                    muted
                                    component="video"
                                    src={this.state.selectedFileURL}
                                ></CardMedia>
                                <Typography
                                    sx={{ fontSize: 14 }}
                                    color="text.secondary"
                                    component="span"
                                    gutterBottom
                                >
                                    <div>
                                        Filename: {this.state.selectedFile.name}
                                    </div>
                                    <div>
                                        Filetype: {this.state.selectedFile.type}
                                    </div>
                                    <div>
                                        Size in bytes:{' '}
                                        {this.state.selectedFile.size}
                                    </div>
                                    <div>
                                        lastModifiedDate:{' '}
                                        {this.state.selectedFile.lastModifiedDate.toLocaleDateString()}
                                    </div>
                                </Typography>
                            </div>
                        ) : (
                            <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                            >
                                Upload your video
                            </Typography>
                        )}
                        <label
                            htmlFor={`${this.props.id}-contained-button-file`}
                        >
                            <Input
                                accept="video/*"
                                id={`${this.props.id}-contained-button-file`}
                                type="file"
                                onChange={this.changeHandler}
                            />
                            <Button
                                variant="contained"
                                component="span"
                                onClick={this.handleSubmission}
                            >
                                Upload
                            </Button>
                        </label>
                        <label htmlFor={`${this.props.id}-icon-button-file`}>
                            <Input
                                accept="video/*"
                                id={`${this.props.id}-icon-button-file`}
                                type="file"
                            />
                            <IconButton
                                color="primary"
                                aria-label="upload video"
                                component="span"
                            >
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default VideoUploadCard
