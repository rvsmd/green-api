import styles from './EmptyChatState.module.scss';

export const EmptyChatState = () => (
  <section aria-label="Чат не выбран" className={styles.state}>
    <div aria-hidden="true" className={styles.icon}>
      ✦
    </div>
    <h2>Выберите чат</h2>
    <p>Создайте чат по номеру телефона или откройте его из списка.</p>
  </section>
);
