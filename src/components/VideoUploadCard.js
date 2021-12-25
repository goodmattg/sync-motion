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

import * as mpPose from '@mediapipe/pose'
import * as drawingUtils from '@mediapipe/drawing_utils'

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
            //
            nextKeypoints: 0,
            // pulled from the web codecs example
            frames: 0,
            consume: 0,
        }
    }

    onResults = (results) => {
        let canvasId = `${this.props.id}-output-canvas`
        let canvas = document.getElementById(canvasId)
        let ctx = canvas.getContext('2d')
        // Draw the overlays.
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

        if (results.poseLandmarks) {
            let currentKeypoint = `keypoints-${this.state.nextKeypoints}`

            if (!(currentKeypoint in this.state)) {
                console.log(`Added keypoints for ${currentKeypoint}`)
                this.setState((_) => ({
                    [currentKeypoint]: results.poseLandmarks,
                }))
            }

            // this.setState((_) => ({
            //     [currentKeypoint]: results.poseLandmarks,
            // }))
            drawingUtils.drawConnectors(
                ctx,
                results.poseLandmarks,
                mpPose.POSE_CONNECTIONS,
                { visibilityMin: 0.65, color: 'white' }
            )
            drawingUtils.drawLandmarks(
                ctx,
                Object.values(mpPose.POSE_LANDMARKS_LEFT).map(
                    (index) => results.poseLandmarks[index]
                ),
                {
                    visibilityMin: 0.65,
                    color: 'white',
                    fillColor: 'rgb(255,138,0)',
                }
            )
            drawingUtils.drawLandmarks(
                ctx,
                Object.values(mpPose.POSE_LANDMARKS_RIGHT).map(
                    (index) => results.poseLandmarks[index]
                ),
                {
                    visibilityMin: 0.65,
                    color: 'white',
                    fillColor: 'rgb(0,217,231)',
                }
            )
            drawingUtils.drawLandmarks(
                ctx,
                Object.values(mpPose.POSE_LANDMARKS_NEUTRAL).map(
                    (index) => results.poseLandmarks[index]
                ),
                { visibilityMin: 0.65, color: 'white', fillColor: 'white' }
            )
        }
        ctx.restore()
    }

    async loadVideo() {
        let cardId = `${this.props.id}-card`
        let cardElement = document.getElementById(cardId)
        var video = cardElement.getElementsByTagName('video')[0]

        let playing = false
        let timeupdate = false

        video.autoplay = true
        video.muted = true
        video.loop = true

        video.play()

        const checkStatus = () => playing && timeupdate

        return new Promise((res, rej) => {
            video.addEventListener(
                'playing',
                () => {
                    playing = true
                    if (checkStatus()) {
                        res(video)
                    }
                },
                true
            )

            video.addEventListener(
                'timeupdate',
                () => {
                    timeupdate = true
                    if (checkStatus()) {
                        res(video)
                    }
                },
                true
            )
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.selectedFileURL != prevState.selectedFileURL) {
            // let cardId = `${this.props.id}-card`
            // let cardElement = document.getElementById(cardId)
            // var video = cardElement.getElementsByTagName('video')[0]

            // TODO: Destroy all existing keypoints

            this.props.pose.onResults(this.onResults)

            const video = await this.loadVideo()
            video.pause()
            video.currentTime = 0

            let frameCount = 0
            let start = Date.now()
            let ended = false

            const cb = async (now, metadata) => {
                frameCount = metadata.presentedFrames
                // TODO: FIX BROKEN
                this.setState((_) => ({
                    nextKeypoints: metadata.presentedFrames,
                }))
                this.props.pose.send({
                    image: video,
                    at: metadata.presentedFrames,
                })
                video.requestVideoFrameCallback(cb)
                console.log(metadata.mediaTime, metadata.presentedFrames)
            }
            video.onended = () => {
                console.log('ended')
                ended = true
                this.setState((_) => ({
                    frames: frameCount,
                    consume: Date.now() - start,
                }))
            }

            video.requestVideoFrameCallback(cb)
            video.play()
        }
    }

    changeHandler = (e) => {
        let file = e.target.files[0]
        this.setState((_) => ({
            selectedFile: file,
            selectedFileURL: URL.createObjectURL(file),
            isSelected: true,
        }))
        console.log('Handle change')
    }

    handleSubmission = (e) => {
        console.log('Handle submission')
    }

    render() {
        return (
            <div>
                <Card id={`${this.props.id}-card`} sx={{ minWidth: 275 }}>
                    <CardContent>
                        {this.state.selectedFile ? (
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
                <div display="block" padding="16">
                    <div>
                        <canvas id={`${this.props.id}-output-canvas`}></canvas>
                    </div>
                </div>
            </div>
        )
    }
}

export default VideoUploadCard
