import React from "react";

export const triggerFileDownload =  (url, file) => {
  window.location.href = `${url}${file}`;
};
