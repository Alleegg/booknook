const API_URL = 'http://localhost:4000';

const app = Vue.createApp({
  data() {
    return {
      token: localStorage.getItem('token') || '',
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      books: [],
      stats: null,
      register: { email: '', name: '', password: '' },
      login: { email: '', password: '' },
      bookForm: { title: '', description: '' },
      error: '',
    };
  },
  methods: {
    async api(path, options = {}) {
      const res = await fetch(`${API_URL}${path}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    },
    saveAuth(data) {
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    async registerUser() {
      try {
        this.error = '';
        const data = await this.api('/api/auth/register', { method: 'POST', body: this.register });
        this.saveAuth(data);
        await this.loadPrivateData();
      } catch (e) {
        this.error = e.message;
      }
    },
    async loginUser() {
      try {
        this.error = '';
        const data = await this.api('/api/auth/login', { method: 'POST', body: this.login });
        this.saveAuth(data);
        await this.loadPrivateData();
      } catch (e) {
        this.error = e.message;
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      this.books = [];
      this.stats = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    async addBook() {
      try {
        this.error = '';
        const created = await this.api('/api/books', { method: 'POST', body: this.bookForm });
        this.books.unshift(created);
        this.bookForm = { title: '', description: '' };
      } catch (e) {
        this.error = e.message;
      }
    },
    async loadPrivateData() {
      if (!this.token) return;
      try {
        this.books = await this.api('/api/books');
        if (this.user && this.user.role === 'ADMIN') {
          this.stats = await this.api('/api/admin/stats');
        }
      } catch (e) {
        this.error = e.message;
      }
    },
  },
  async mounted() {
    await this.loadPrivateData();
  },
  template: `
    <main class="container">
      <h1>BookNook SPA + JWT</h1>
      <div v-if="!token" class="grid">
        <form @submit.prevent="registerUser">
          <h3>Register</h3>
          <input v-model="register.name" placeholder="Name" />
          <input v-model="register.email" placeholder="Email" />
          <input v-model="register.password" placeholder="Password" type="password" />
          <button type="submit">Create account</button>
        </form>
        <form @submit.prevent="loginUser">
          <h3>Login</h3>
          <input v-model="login.email" placeholder="Email" />
          <input v-model="login.password" placeholder="Password" type="password" />
          <button type="submit">Sign in</button>
        </form>
      </div>
      <div v-else>
        <section class="card">
          <p>Signed in as <b>{{ user.name }}</b> ({{ user.email }}) with role <b>{{ user.role }}</b></p>
          <button @click="logout">Logout</button>
        </section>
        <section class="card">
          <h2>My books (protected endpoint)</h2>
          <form @submit.prevent="addBook">
            <input v-model="bookForm.title" placeholder="Title" />
            <input v-model="bookForm.description" placeholder="Description" />
            <button type="submit">Add book</button>
          </form>
          <ul>
            <li v-for="book in books" :key="book.id"><b>{{ book.title }}</b>: {{ book.description }}</li>
          </ul>
        </section>
        <section class="card">
          <h2>Admin panel (role-based content)</h2>
          <template v-if="user.role === 'ADMIN'">
            <ul v-if="stats">
              <li>Users: {{ stats.usersCount }}</li>
              <li>Books: {{ stats.booksCount }}</li>
              <li>Admins: {{ stats.adminsCount }}</li>
            </ul>
            <p v-else>Loading stats...</p>
          </template>
          <p v-else>Недоступно. Требуется роль ADMIN.</p>
        </section>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </main>
  `,
});

app.mount('#app');
