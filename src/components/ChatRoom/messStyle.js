// Message.styles.js
import styled from "styled-components";

export const WrapperStyled = styled.div`
  margin-bottom: 10px;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
  }

  .file-wrapper {
    margin-top: 6px;
  }

  .file-box {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    max-width: 300px;
    transition: background-color 0.2s;
  }

  .file-box:hover {
    background-color: #e8f4ff;
  }

  .file-icon {
    font-size: 20px;
    margin-right: 10px;
  }

  .file-name {
    flex: 1;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .download-text {
    color: #1890ff;
    font-size: 12px;
  }
`;
