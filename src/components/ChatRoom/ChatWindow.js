import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert, Dropdown, Modal, Menu, message } from 'antd';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import axios from '../../axios';

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible, setSelectedRoomId, fetchRooms } =
    useContext(AppContext);
  const {
    user: { username, avatar , id },
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = async () => {
    try {
      // Gửi tin nhắn qua API
      const response = await axios.post('messages/', {
        content: inputValue,
        room: selectedRoom.id,
        sender:  id,// ID người gửi

      });
  
      if (response.status === 201) {
        message.success('Tin nhắn đã được gửi thành công');
        const newMessage = {
          ...response.data,
          sender: id,
          username: username,
        };
        setMessages((prev) => [...prev, newMessage]);  // Thêm tin nhắn vào danh sách tin nhắn
      }
  
      form.resetFields(['message']); // Reset input field
  
      // Focus lại vào input sau khi gửi
      if (inputRef?.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 0);
      }
    } catch (error) {
      message.error('Gửi tin nhắn thất bại: ' + error.message);
    }
  };
  

  // const condition = React.useMemo(
  //   () => ({
  //     fieldName: 'roomId',
  //     operator: '==',
  //     compareValue: selectedRoom.id,
  //   }),
  //   [selectedRoom.id]
  // );

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Bước 1: Lấy tất cả messages
        const response = await axios.get('messages/', {
          params: { roomId: selectedRoom.id },
          
        });
        
        console.log('Response mess:', response.data);
        const messageList = response.data;
  
        // Bước 2: Lấy danh sách các sender IDs (duy nhất)
        const senderIds = [...new Set(messageList.map(msg => msg.sender))];
  
        // Bước 3: Gọi API để lấy thông tin người dùng
        const usersResponse = await axios.get(`users/`, {
          params: { ids: senderIds.join(',') },
        });
  
        // Tạo map từ userId => username
        const userMap = {};
        usersResponse.data.forEach(user => {
          userMap[user.id] = user.username;  // hoặc displayName
        });
  
        // Bước 4: Gắn displayName vào từng message
        const messagesWithSenderNames = messageList.map(msg => ({
          ...msg,
          username: userMap[msg.sender] || 'Unknown',
          createdAt: msg.timestamp,
        }));
        console.log('Messages with sender names:', messagesWithSenderNames);
        setMessages(messagesWithSenderNames);
      } catch (error) {
        message.error('Không thể tải tin nhắn: ' + error.message);
      }
    };
  
    if (selectedRoom.id) {
      fetchMessages();
    }
  }, [selectedRoom.id]);
  


  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  const handleRenameRoom = async () => {
    if (newRoomName.trim() === '') {
      message.error('Tên phòng không được để trống');
      return;
    }
  
    console.log('Đang đổi tên phòng:', selectedRoom.id, 'thành', newRoomName.trim());
  
    try {
      // Gửi yêu cầu PUT đến API để cập nhật tên phòng
      const response = await axios.patch(`rooms/${selectedRoom.id}/`, {
        name: newRoomName.trim(),
      });
  
      if (response.status === 200) {
        console.log('Đổi tên phòng thành công');
        message.success('Đổi tên phòng thành công');
        setNewRoomName('');
        setIsRenameModalVisible(false);
              // Cập nhật lại selectedRoom và danh sách phòng
        setSelectedRoomId(response.data.id);  // Cập nhật selectedRoomId để nó tự động cập nhật selectedRoom
        fetchRooms();  // Làm mới danh sách phòng
      }
    } catch (error) {
      console.error('Lỗi khi đổi tên phòng:', error);
      message.error('Đổi tên phòng thất bại: ' + error.message);
    }
  };
  

  const handleDeleteRoom = async () => {
    console.log('Đang xóa phòng:', selectedRoom.id);
  
    try {
      // Gửi yêu cầu DELETE tới API để xóa phòng
      const response = await axios.delete(`rooms/${selectedRoom.id}/`);
  
      if (response.status === 204) {  // Status 204 nghĩa là thành công và không có nội dung trả về
        console.log('Xóa phòng thành công');
        message.success('Xóa phòng thành công');
        setIsDeleteModalVisible(false);
        setSelectedRoomId('');
        fetchRooms();  // Làm mới danh sách phòng
      }
    } catch (error) {
      console.error('Lỗi khi xóa phòng:', error);
      message.error('Xóa phòng thất bại: ' + error.message);
    }
  };
  

  const handleMenuClick = (e) => {
    if (e.key === '1') {
      setNewRoomName(selectedRoom.name);
      setIsRenameModalVisible(true);
    } else if (e.key === '2') {
      setIsDeleteModalVisible(true);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<EditOutlined />}>
        Đổi tên nhóm
      </Menu.Item>
      <Menu.Item key="2" icon={<DeleteOutlined />} danger>
        Xóa nhóm
      </Menu.Item>
    </Menu>
  );

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className='header__info'>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button type="text" className='header__title' style={{ padding: 0, margin: 0, height: 'auto' }}>
                  {selectedRoom.name}
                </Button>
              </Dropdown>
              <span className='header__description'>
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type='text'
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size='small' maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.username} key={member.id}>
                    <Avatar src={member.avatar}>
                      {member.avatar
                        ? ''
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={mes.content}
                  photoURL={mes.photoURL}
                  displayName={mes.username}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name='message'>
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder='Nhập tin nhắn...'
                  bordered={false}
                  autoComplete='off'
                />
              </Form.Item>
              <Button type='primary' onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
          <Modal
            title="Đổi tên nhóm"
            visible={isRenameModalVisible}
            onOk={handleRenameRoom}
            onCancel={() => setIsRenameModalVisible(false)}
          >
            <Input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Nhập tên mới cho nhóm"
              onPressEnter={handleRenameRoom}
              autoFocus
            />
          </Modal>
          <Modal
            title="Xóa nhóm"
            visible={isDeleteModalVisible}
            onOk={handleDeleteRoom}
            onCancel={() => setIsDeleteModalVisible(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <p>Bạn có chắc chắn muốn xóa nhóm này không?</p>
          </Modal>
        </>
      ) : (
        <Alert
          message='Hãy chọn phòng'
          type='info'
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
