import config from './config';

const Api = {
  handleError(data, status) {
    const err = (data && data.message) || status;
    console.log(err);
    return { status, message: err };
  },

  async handleResponse(response) {
    if (response.status === 204) {
      return {
        err: {
          status: 204,
          message: response.statusText,
        },
        data: {
          message: response.statusText,
        },
      };
    }

    let err = false;
    const data = await response.json();

    if (!response.ok) {
      err = this.handleError(data, response.status);
    }

    return { err, data };
  },

  requestOptions(method, token, body) {
    const options = { method };
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    if (body) {
      options.body = JSON.stringify(body);
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      };
    }
    return options;
  },

  tasks: {
    api: `${config.api}/tasks`,

    async getTasks(token, uuid) {
      const response = await fetch(`${this.api}/${uuid}`,
        Api.requestOptions('GET', token));
      const res = await Api.handleResponse(response);

      return res;
    },

    async addTask(token, uuid, body) {
      const response = await fetch(`${this.api}/${uuid}`,
        Api.requestOptions('POST', token, body));
      const res = await Api.handleResponse(response);

      return res;
    },

    async updateTask(token, uuid, taskId, body) {
      const response = await fetch(`${this.api}/${uuid}/${taskId}`,
        Api.requestOptions('PATCH', token, body));
      const res = await Api.handleResponse(response);

      return res;
    },

    async deleteTask(token, uuid, taskId) {
      const response = await fetch(`${this.api}/${uuid}/${taskId}`,
        Api.requestOptions('DELETE', token));
      const res = await Api.handleResponse(response);

      return res;
    },
  },

  async login(body) {
    const response = await fetch(`${config.api}/login`,
      this.requestOptions('POST', null, body));
    const data = await response.json();

    return this.handleResponse(response, data);
  },

  async register(body) {
    const response = await fetch(`${config.api}/register`,
      this.requestOptions('POST', null, body));
    const data = await response.json();

    return this.handleResponse(response, data);
  },
};

export default Api;
