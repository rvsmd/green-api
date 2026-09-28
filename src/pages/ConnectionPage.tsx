import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@app/session/SessionProvider';
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
    <main className="connection">
      <form onSubmit={submit}>
        <h1>MAX Чаты</h1>
        <p>Подключите инстанс GREEN-API</p>
        <label>
          Id инстанса
          <input value={idInstance} onChange={(e) => setId(e.target.value)} />
        </label>
        <label>
          API token
          <input
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setToken(e.target.value)}
          />
        </label>
        <button type="submit">Продолжить</button>
      </form>
    </main>
  );
};
