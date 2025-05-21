// src/components/Login.js
import React from 'react';
import { supabase } from '../supabaseClient';

const Login = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Ошибка входа через Google:', error.message);
  };

  return (
    <button onClick={handleGoogleLogin}>
      Войти через Google
    </button>
  );
};

export default Login;
