import React from "react";
import { Typography } from "@material-ui/core";

export const SupplementalText = ({ children }) => (
  <Typography variant="body2" component="div" style={{ marginTop: "10px" }}>
    {children}
  </Typography>
);
export const QuestionText = ({ children }) => (
  <Typography variant="body1" component="div" style={{ marginBottom: "10px" }}>
    {children}
  </Typography>
);
export const HeadingText = ({ children }) => (
  <Typography variant="h6" component="div">
    {children}
  </Typography>
);
export const paperClass = {
  padding: "10px",
  margin: "20px",
  width: "90%",
};
