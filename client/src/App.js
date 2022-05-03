import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Container, Typography } from '@mui/material';

import axios from 'axios';

function App() {
  const [result, setResult] = useState([]);
  const [key, setKey] = useState('');
  return (
    <Container maxWidth='md'>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        my: 5
      }}>
        <Paper
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%', boxShadow: 2}}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search SAP"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
            }}
          />
          <IconButton sx={{ p: '10px' }} onClick={() => {
            axios.get(`http://localhost:5005/search?key=${key}`).then(res => {
              setResult(res.data);
              console.log(res.data);
            })
          }} >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      {result.length === 0 ? null : (
        result.map(r => (
          <Box sx={{
            my: 4
          }}>
            <Typography variant='h5'>{r._source.title}</Typography>
            {r.highlight.content.map((v, i) => (
              <Typography key={i}>{v}</Typography>
            ))}
          </Box>

        ))
      )}
    </Container>
  );
}

export default App;
