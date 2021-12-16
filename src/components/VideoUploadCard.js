import * as React from "react";
import { styled } from "@mui/material/styles";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { CardMedia } from "@mui/material";
import * as mpPose from "@mediapipe/pose";
import * as drawingUtils from "@mediapipe/drawing_utils";

const Input = styled("input")({
  display: "none",
});

const VideoUploadCard = (props) => {
  const [selectedFile, setSelectedFile] = React.useState();
  const [selectedFileURL, setSelectedFileURL] = React.useState();
  const [isSelected, setIsSelected] = React.useState(false);

  const options = {
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
    },
  };

  const canvasElement = React.useRef(null);
  const canvasCtx = React.useRef(null);
  const videoElement = React.useRef(null);

  React.useEffect(() => {
    if (isSelected) {
      let canvasId = `${props.id}-output_canvas`;
      let cardId = `${props.id}-card`;
      let cardElement = document.getElementById(cardId);
      canvasElement.current = document.getElementById(canvasId);
      canvasCtx.current = canvasElement.current.getContext("2d");
      videoElement.current = cardElement.getElementsByTagName("video")[0];

      console.log(videoElement.current);
      console.log(selectedFileURL);
    }
  });

  const onResults = (results) => {
    // Hide the spinner.
    document.body.classList.add("loaded");

    let canvas = canvasElement.current;
    let ctx = canvasCtx.current;
    // Draw the overlays.
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      drawingUtils.drawConnectors(
        ctx,
        results.poseLandmarks,
        mpPose.POSE_CONNECTIONS,
        { visibilityMin: 0.65, color: "white" }
      );
      drawingUtils.drawLandmarks(
        ctx,
        Object.values(mpPose.POSE_LANDMARKS_LEFT).map(
          (index) => results.poseLandmarks[index]
        ),
        { visibilityMin: 0.65, color: "white", fillColor: "rgb(255,138,0)" }
      );
      drawingUtils.drawLandmarks(
        ctx,
        Object.values(mpPose.POSE_LANDMARKS_RIGHT).map(
          (index) => results.poseLandmarks[index]
        ),
        { visibilityMin: 0.65, color: "white", fillColor: "rgb(0,217,231)" }
      );
      drawingUtils.drawLandmarks(
        ctx,
        Object.values(mpPose.POSE_LANDMARKS_NEUTRAL).map(
          (index) => results.poseLandmarks[index]
        ),
        { visibilityMin: 0.65, color: "white", fillColor: "white" }
      );
    }
    ctx.restore();
  };

  const changeHandler = (e) => {
    let file = e.target.files[0];
    setSelectedFile(file);
    setSelectedFileURL(URL.createObjectURL(file));
    setIsSelected(true);
    // console.log(file);
    // console.log(URL.createObjectURL(file));
  };

  const handleSubmission = (e) => {
    console.log("HERE");
  };

  const pose = new mpPose.Pose(options);
  pose.onResults(onResults);

  return (
    <Card id={`${props.id}-card`} sx={{ minWidth: 275 }}>
      <CardContent>
        {isSelected ? (
          <div>
            <CardMedia
              autoPlay
              loop
              muted
              component="video"
              src={selectedFileURL}
            ></CardMedia>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Filename: {selectedFile.name}
              Filetype: {selectedFile.type}
              Size in bytes: {selectedFile.size}
              lastModifiedDate:{" "}
              {selectedFile.lastModifiedDate.toLocaleDateString()}
            </Typography>
            <canvas
              id={`${props.id}-output_canvas`}
              height="720px"
              width="1280px"
            ></canvas>
          </div>
        ) : (
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Upload your video
          </Typography>
        )}
        <label htmlFor={`${props.id}-contained-button-file`}>
          <Input
            accept="video/*"
            id={`${props.id}-contained-button-file`}
            type="file"
            onChange={changeHandler}
          />
          <Button
            variant="contained"
            component="span"
            onClick={handleSubmission}
          >
            Upload
          </Button>
        </label>
        <label htmlFor={`${props.id}-icon-button-file`}>
          <Input
            accept="video/*"
            id={`${props.id}-icon-button-file`}
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
  );
};
export default VideoUploadCard;
