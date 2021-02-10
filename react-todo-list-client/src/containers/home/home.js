import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  Box,
  CssBaseline,
  CircularProgress,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  Paper,
  Fab,
  List,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core/';
import { AccountCircle, Add, Clear } from '@material-ui/icons/';
import { Context } from '../../store/store';
import Api from '../../api/api';

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    height: 500,
    overflow: 'auto',
    paddingBottom: 20,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
  bottomBar: {
    backgroundColor: '#3949ab',
    height: 60,
  },
  title: {
    color: '#f6f5f5',
  },
  addButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
    color: '#f6f5f5',
    backgroundColor: '#00227b',
    '&:hover': {
      backgroundColor: '#032c96',
    },
  },
  accountButton: {
    color: '#f6f5f5',
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function Home() {
  const classes = useStyles();
  const [state, store] = useContext(Context);
  const [redirect, setRedirect] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.username || !state.token || !state.uuid) {
      exit();
    }
    getTasks();
  }, []);

  const getTasks = async () => {
    const { err, data } = await Api.tasks.getTasks(state.token, state.uuid);
    if (err && err.status === 401) {
      exit();
    } else {
      setLoading(false);
      setTasks(data.tasks);
    }
  };

  const exit = () => {
    store({ action: 'destroyUser' });
    setRedirect('/login');
  };

  const handleCheck = (i, id) => {
    setTasks((prevState) => {
      Api.tasks.updateTask(state.token, state.uuid, id, { checked: !prevState[i].checked });
      const tasksCopy = [...prevState];
      tasksCopy[i] = {
        ...tasksCopy[i],
        checked: !tasksCopy[i].checked,
      };
      return tasksCopy;
    });
  };

  const handleRemove = async (id) => {
    setLoading(true);
    await Api.tasks.deleteTask(state.token, state.uuid, id);
    getTasks();
  };

  const openMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setError(false);
    setModalOpen(false);
  };

  const handleChange = (e) => {
    setError(false);
    setInput(e.target.value);
  };

  const addTask = async () => {
    if (input === '') {
      setError(true);
      return;
    }
    setLoading(true);
    closeModal();
    setInput('');
    await Api.tasks.addTask(state.token, state.uuid, { data: input });
    getTasks();
  };

  const Item = ({
    id, index, checked, data,
  }) => (
    <ListItem key={index} role={undefined} dense button onClick={() => handleCheck(index, id)}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={Boolean(checked)}
          tabIndex={-1}
          color="primary"
        />
      </ListItemIcon>
      <ListItemText
        primary={data}
        className={checked ? classes.strikethrough : null}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" onClick={() => handleRemove(id)}>
          <Clear />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );

  const TaskList = ({ items }) => {
    if (items.length === 0) {
      return (
        <Box display="flex" justifyContent="center">
          <Typography>Add your first task!</Typography>
        </Box>
      );
    }
    return (
      <List className={classes.list}>
        {items.map(({ id, data, checked }, i) => (
          <Item key={id} id={id} index={i} checked={checked} data={data} />
        ))}
      </List>
    );
  };

  const LoadingCircle = () => (
    <Box display="flex" justifyContent="center">
      <CircularProgress />
    </Box>
  );

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={12}>
        <Container maxWidth="sm">
          <CssBaseline />
          <Paper className={classes.paper} elevation={3} square>
            <Typography className={classes.text} variant="h5" gutterBottom>
              Todo List
            </Typography>
            {loading
              ? <LoadingCircle />
              : <TaskList items={tasks} />}
          </Paper>
          <Box className={classes.bottomBar} boxShadow={3}>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                {state.username}
              </Typography>
              <Fab className={classes.addButton} onClick={openModal}>
                <Add />
              </Fab>
              <div className={classes.grow} />
              <IconButton edge="end" className={classes.accountButton} onClick={openMenu}>
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={menuOpen}
                onClose={closeMenu}
              >
                <MenuItem onClick={exit}>
                  Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </Box>
          <Dialog open={modalOpen} onClose={closeModal} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Task</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Task"
                fullWidth
                onChange={handleChange}
                error={error}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} color="primary">
                Cancel
              </Button>
              <Button onClick={addTask} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Grid>
    </Grid>
  );
}
