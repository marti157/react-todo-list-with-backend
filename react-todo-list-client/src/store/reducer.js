const Reducer = (state, values) => {
  switch (values.action) {
    case 'saveSuccess':
      localStorage.setItem('success', values.success);
      return {
        ...state,
        success: values.success,
      };
    case 'destroySuccess':
      localStorage.setItem('success', '');
      return {
        ...state,
        success: null,
      };
    case 'saveUser':
      localStorage.setItem('uuid', values.uuid);
      localStorage.setItem('token', values.token);
      localStorage.setItem('username', values.username);
      return {
        ...state,
        uuid: values.uuid,
        token: values.token,
        username: values.username,
      };
    case 'destroyUser':
      localStorage.setItem('uuid', '');
      localStorage.setItem('token', '');
      localStorage.setItem('username', '');
      return {
        uuid: null,
        token: null,
        username: null,
      };
    default:
      return state;
  }
};

export default Reducer;
