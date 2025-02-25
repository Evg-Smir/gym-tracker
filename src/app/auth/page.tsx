'use client';

import { useState, FormEvent } from 'react';

import { useRouter } from 'next/navigation';

import { loginUser, registerUser, logoutUser } from '@/lib/firebase';
import { getUserData } from '@/db/client';

import { Button, TextField, Typography } from '@mui/material';
import { useUserStore } from '@/stores/userStore';

export default function AuthenticationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const setUser = useUserStore((state) => state.setUserData);

  const setUserData = async (uid: string) => {
    const data = await getUserData(uid);
    setUser({ ...data, uid });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const userData = await registerUser(email, password, firstName, lastName);
      setUserData(userData.user.uid);

      await router.push('/');
    } catch (err) {
      setError('Ошибка при регистрации. Попробуйте снова.');
    }
  };

  const handleLogin = async () => {
    try {
      const userData = await loginUser(email, password)
      setUserData(userData.user.uid);

      await router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    alert('Вы вышли из аккаунта!');
  };

  return (
    <>
      <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
        <h1>Вход</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Войти</button>
        <button onClick={handleLogout}>Выйти</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <br />
      <br />
      <br />
      <br />

      <div>
        <Typography variant="h4">Регистрация</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Имя"
            variant="outlined"
            fullWidth
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Фамилия"
            variant="outlined"
            fullWidth
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Пароль"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" fullWidth>
            Зарегистрироваться
          </Button>
        </form>
      </div>
    </>
  )
    ;
}
