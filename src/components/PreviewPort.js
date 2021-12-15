import * as React from 'react';
import VideoUploadCard from './VideoUploadCard';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';


export default function PreviewPort() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6}>
                    <VideoUploadCard></VideoUploadCard>
                </Grid>
                <Grid VideoUploadCard xs={6}>
                    <VideoUploadCard></VideoUploadCard>
                </Grid>
                <Grid item xs={12} md={8} lg={6}>
                    <LoadingButton size="large" variant="outlined">Align!</LoadingButton>
                </Grid>
            </Grid>
        </Box>
    )
};