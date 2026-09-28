type Props = { value: string; onChange: (value: string) => void; onSubmit: () => void };
export const MessageComposer = ({ value, onChange, onSubmit }: Props) => (
  <footer>
    <textarea
      placeholder="Сообщение"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          onSubmit();
        }
      }}
    />
    <button onClick={onSubmit}>Отправить</button>
  </footer>
);
