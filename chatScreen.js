import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { setActiveChat } from '../redux/chatSlice';
import { Box, Typography, TextField, Avatar, IconButton, Button, InputAdornment } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { auth } from '../firebase';
import { sendMessage, subscribeToMessages } from '../services/chatService';
import KeyboardArrowDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';

function ChatScreen() {
  const dispatch = useDispatch();
  const { chats, activeChatId, messages } = useSelector((state) => state.chat);
  const [typedMessage, setTypedMessage] = useState("");
  const activeChat = chats.find((e) => e.id === activeChatId);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((fetchedMessages) => {
      dispatch({ type: 'chat/setMessages', payload: fetchedMessages });
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleSend = async () => {
    if (typedMessage.trim() && auth.currentUser) {
      await sendMessage(typedMessage, auth.currentUser);
      setTypedMessage('');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#111' }}>

      <Box sx={{ display: 'flex', flex: 1, height: '100%' }}>

        <Box sx={{ width: 350, borderRight: '1px solid #2a2a2a', bgcolor: '#151717', display: 'flex', flexDirection: 'column', height: '100%' }}>

          <Box sx={{ flexShrink: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#151717' }}>
              <Typography variant="h5" sx={{ m: 0, color: '#fff', fontWeight: 'bold', width: '199.59px', height: '28px' }}>Whatsapp</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: '#fff' }}><AddCommentIcon /></IconButton>
                <IconButton sx={{ color: '#fff' }} onClick={() => dispatch(logout())}><Logout /></IconButton>
              </Box>
            </Box>

            <Box sx={{ px: 2, pt: 0, pb: 1, bgcolor: '#151717' }}>
              <TextField fullWidth size="small" placeholder="Search or start a new chat" variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#888', fontSize: "20px", }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#303131',
                    borderRadius: '50px',
                    color: '#fff'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#AFAFAF',
                    opacity: 1,
                    fontSize: "14px",
                  }
                }}
              />
            </Box>

            <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', mb: 1 }}>
              <Button variant="text" sx={{ color: '#d9fdd3', bgcolor: '#0a332c', borderRadius: '20px', textTransform: 'none', minWidth: 'auto', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 'bold' }}>All</Button>
              <Button variant="text" sx={{ color: '#ffffff99', bgcolor: '#202223', borderRadius: '20px', textTransform: 'none', minWidth: 'auto', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 'bold', '&:hover': { bgcolor: '#2a2b2c' } }}>Unread</Button>
              <Button variant="text" sx={{ color: '#ffffff99', bgcolor: '#202223', borderRadius: '20px', textTransform: 'none', minWidth: 'auto', px: 2, py: 0.5, fontSize: '0.85rem', fontWeight: 'bold', '&:hover': { bgcolor: '#2a2b2c' } }}>Favourites</Button>
              <IconButton size="small" sx={{ color: '#ffffff99', bgcolor: '#202223', p: 0.5, '&:hover': { bgcolor: '#2a2b2c' } }}>
                <KeyboardArrowDownIcon fontSize="medium" />
              </IconButton>
            </Box>

            <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto', mb: 1 }}>
              <IconButton size="small" sx={{ color: '#afafaf', p: 0.5 }}>
                <ArchiveIcon fontSize="medium" />
              </IconButton>
              <Button variant="text" sx={{ color: '#afafaf', textTransform: 'none', minWidth: 'auto', px: 2, py: 0.5 }}>Archived</Button>
            </Box>
          </Box>

          <Box sx={{
            flex: 1, overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#555', borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb:hover': { background: '#777' },
          }}>
            {chats.map((chat) => (
              <Box
                key={chat.id}
                onClick={() => dispatch(setActiveChat(chat.id))}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: activeChatId === chat.id ? '#303131' : '#151717',
                  '&:hover': { bgcolor: '#252525' }
                }}
              >
                <Avatar sx={{ bgcolor: chat.avatarColor }}>{chat.avatar}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff' }}>{chat.username}</Typography>
                  <Typography variant="body2" sx={{ color: '#888' }}>{chat.lastMessage}</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#666' }}>{chat.time}</Typography>
              </Box>
            ))}
          </Box>
        </Box>


        {activeChat ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#1a1a1a', height: '100%' }}>
            <Box sx={{ p: 2, bgcolor: '#151717', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
              <Avatar sx={{ bgcolor: activeChat.avatarColor }}>{activeChat.avatar}</Avatar>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fff', lineHeight: 1.2 }}>
                  {activeChat.username}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  {activeChat.online ? "Online" : "Offline"}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ color: '#ffffff99', p: 0.5, '&:hover': { bgcolor: '#2b2f2f' } }}>
                  <SearchIcon fontSize="medium" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#ffffff99', p: 0.5, '&:hover': { bgcolor: '#2d2f2f' } }}>
                  <MoreVertIcon fontSize="medium" />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{
              flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5,
              backgroundImage: `url("https://i.pinimg.com/564x/d3/6b/cc/d36bcceceaa1d390489ec70d93154311.jpg")`,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { background: '#555', borderRadius: '10px' },
              '&::-webkit-scrollbar-thumb:hover': { background: '#777' },
            }}>
              {/* Real-time messages from Firestore */}
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{ display: 'flex', justifyContent: msg.uid === auth.currentUser?.uid ? 'flex-end' : 'flex-start' }}
                >
                  <Box sx={{
                    bgcolor: msg.uid === auth.currentUser?.uid ? '#075E54' : '#2a2a2a',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '60%',
                    boxShadow: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      {msg.avatar && (
                        <Avatar src={msg.avatar} sx={{ width: 20, height: 20 }} />
                      )}
                      <Typography variant="caption" sx={{ color: '#0bc' }}>
                        {msg.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#fff' }}>{msg.text}</Typography>
                  </Box>
                </Box>
              ))}
              {/* Mock messages as fallback */}
              {messages.length === 0 && activeChat.messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}
                >
                  <Box sx={{
                    bgcolor: msg.sender === 'me' ? '#075E54' : '#2a2a2a',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '60%',
                    boxShadow: 1
                  }}>
                    <Typography variant="body2" sx={{ color: '#fff' }}>{msg.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: '#aaa', mt: 0.5 }}>
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>


            <Box sx={{ p: 2, bgcolor: '#151717', display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ gap: 0.5 }}>
                        <AddIcon sx={{ color: '#888', cursor: 'pointer', fontSize: '22px' }} />
                        <EmojiEmotionsIcon sx={{ color: '#888', cursor: 'pointer', fontSize: '22px' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <KeyboardVoiceIcon sx={{ color: '#888', cursor: 'pointer', fontSize: '22px' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: '#303131', borderRadius: 2, color: '#fff' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiInputBase-input::placeholder': { color: '#888', opacity: 1 }
                }}
              />
              <IconButton
                sx={{ color: '#fff', bgcolor: '#075E54', borderRadius: 2, p: 1.5, '&:hover': { bgcolor: '#055242' } }}
                onClick={handleSend}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>

          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export default ChatScreen;