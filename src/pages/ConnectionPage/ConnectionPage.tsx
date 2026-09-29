import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSession } from '@app/session/useSession';

import styles from './ConnectionPage.module.scss';

export const ConnectionPage = () => {
  const { connect } = useSession();
  const navigate = useNavigate();
  const [idInstance, setId] = useState('');
  const [apiTokenInstance, setToken] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!idInstance || !apiTokenInstance) return;

    connect({ idInstance, apiTokenInstance });
    void navigate('/chats');
  };

  return (
    <main className={styles['connection-page']}>
      <form className={styles['connection-page__form']} onSubmit={submit}>
        <h1>MAX Чаты</h1>
        <p>Подключите инстанс GREEN-API</p>
        <label className={styles['connection-page__label']}>
          Id инстанса
          <input value={idInstance} onChange={(event) => setId(event.target.value)} />
        </label>
        <label className={styles['connection-page__label']}>
          API token
          <input
            type="password"
            value={apiTokenInstance}
            onChange={(event) => setToken(event.target.value)}
          />
        </label>
        <button type="submit">Продолжить</button>
      </form>
    </main>
  );
};
