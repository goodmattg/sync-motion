import * as React from 'react'
import VideoUploadCard from './VideoUploadCard'
import Box from '@mui/material/Box'

import Grid from '@mui/material/Grid'
import LoadingButton from '@mui/lab/LoadingButton'

import * as mpPose from '@mediapipe/pose'

class PreviewPort extends React.Component {
    constructor(props) {
        super(props)

        let pose = new mpPose.Pose(this.options)
        pose.setOptions({ modelComplexity: 2 })
        pose.onResults(this.onResults)

        this.state = {
            video_1: null,
            video_2: null,
            mediapipeInitialized: false,
            pose: pose,
        }
    }

    async componentDidMount() {
        await this.state.pose.initialize()
        this.setState((_) => ({
            mediapipeInitialized: true,
        }))
        console.log('MediaPipe loaded')
    }

    options = {
        locateFile: (file) => {
            console.log('Pose loading', file)
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`
        },
    }

    syncClick = () => {
        console.log('Sync clicked')
    }

    render() {
        return (
            this.state.mediapipeInitialized && (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6}>
                            <VideoUploadCard
                                pose={this.state.pose}
                                id="video-upload-1"
                            ></VideoUploadCard>
                        </Grid>
                        <Grid item xs={6}>
                            <VideoUploadCard
                                pose={this.state.pose}
                                id="video-upload-2"
                            ></VideoUploadCard>
                        </Grid>
                        <Grid item xs={12} md={8} lg={6}>
                            <LoadingButton
                                size="large"
                                variant="outlined"
                                onClick={this.syncClick}
                            >
                                Sync!
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Box>
            )
        )
    }
}

export default PreviewPort
