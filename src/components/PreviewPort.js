import * as React from "react";
import VideoUploadCard from "./VideoUploadCard";
import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";

class PreviewPort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      video_1: null,
      video_2: null,
    };
  }

  uploadClick = () => {
    console.log("Upload clicked");
  };
  render() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6}>
            <VideoUploadCard id="video-upload-1"></VideoUploadCard>
          </Grid>
          <Grid item xs={6}>
            <VideoUploadCard id="video-upload-2"></VideoUploadCard>
          </Grid>
          <Grid item xs={12} md={8} lg={6}>
            <LoadingButton
              size="large"
              variant="outlined"
              onClick={this.uploadClick}
            >
              Align!
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default PreviewPort;
