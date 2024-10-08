import { useRouter } from 'next/router';
import { useState } from 'react';
import { apiClient } from 'utils/apiClient';
import styles from './Login.module.css';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await apiClient.auth.$post({
        body: { name, password },
      });
      const { token } = response;
      localStorage.setItem('authToken', token);
      router.push('/');
    } catch (err) {
      setError('ログインに失敗しました。再度お試しください。');
    }
  };

  const goToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLogin} className={styles.button}>
        Login
      </button>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.signupLink}>
        New here?{' '}
        <span onClick={goToSignup} className={styles.link}>
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
