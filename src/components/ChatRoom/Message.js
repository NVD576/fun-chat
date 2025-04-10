import React from "react";
import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns/esm";
import { WrapperStyled } from "./messStyle";

function formatDate(seconds) {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export default function Message({
  text,
  displayName,
  createdAt,
  photoURL,
  image,
  file,
}) {
  return (
    <WrapperStyled>
      <div>
        <Avatar size="small" src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="author">{displayName}</Typography.Text>
        <Typography.Text className="date">
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>

      <div className="content">
        {image && (
          <div style={{ marginTop: 8 }}>
            <img
              src={image}
              alt="Sent"
              style={{
                maxWidth: "250px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        )}

        {file &&
          (file.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) ? (
            <div style={{ marginTop: 8 }}>
              <img
                src={file}
                alt="Sent file"
                style={{
                  maxWidth: "250px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              />
            </div>
          ) : (
            <div className="file-wrapper">
              <a href={file} target="_blank" rel="noopener noreferrer" download>
                <div className="file-box">
                  <span className="file-icon">📎</span>
                  <span className="file-name">{file.split("/").pop()}</span>
                  <span className="download-text">Tải xuống</span>
                </div>
              </a>
            </div>
          ))}

        {text && <Typography.Text>{text}</Typography.Text>}
      </div>
    </WrapperStyled>
  );
}
