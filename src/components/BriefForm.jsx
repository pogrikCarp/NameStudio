import { useRef, useState } from 'react';
import { telegramHref } from '../data/content';
import { trackGoal } from '../hooks/useAnalytics';

const taskOptions = [
  'Бесплатный аудит',
  'Сайт или лендинг',
  'Telegram-бот',
  'MVP нового продукта',
  'Веб-сервис или личный кабинет',
  'Доработка существующего продукта',
  'Пока не знаю — нужна консультация',
];

export default function BriefForm() {
  const [taskType, setTaskType] = useState(taskOptions[0]);
  const [product, setProduct] = useState('');
  const [goal, setGoal] = useState('');
  const started = useRef(false);

  const handleStart = () => {
    if (started.current) return;
    started.current = true;
    trackGoal('brief_start', { placement: 'contact' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = [
      'Здравствуйте! Хочу обсудить задачу.',
      `Тип задачи: ${taskType}.`,
      `Продукт или ссылка: ${product.trim() || 'пока нет ссылки'}.`,
      `Главная задача: ${goal.trim()}.`,
    ].join('\n');

    const params = { placement: 'contact', task_type: taskType };
    trackGoal('brief_submit', params);
    trackGoal('telegram_click', params);
    trackGoal('audit_click', params);
    window.location.href = telegramHref(message);
  };

  return (
    <form className="brief-form" onFocus={handleStart} onSubmit={handleSubmit} data-reveal>
      <div className="brief-form__field">
        <label htmlFor="brief-task">Что нужно сделать</label>
        <select id="brief-task" value={taskType} onChange={(event) => setTaskType(event.target.value)}>
          {taskOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="brief-form__field">
        <label htmlFor="brief-product">Ссылка или описание продукта</label>
        <input
          id="brief-product"
          type="text"
          value={product}
          onChange={(event) => setProduct(event.target.value)}
          placeholder="https://... или идея в двух словах"
        />
      </div>

      <div className="brief-form__field brief-form__field--wide">
        <label htmlFor="brief-goal">Какой результат нужен</label>
        <textarea
          id="brief-goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="Например: увеличить заявки или автоматизировать запись клиентов"
          rows="4"
          required
        />
      </div>

      <div className="brief-form__actions brief-form__field--wide">
        <button className="button button--primary button--lg" type="submit">
          Продолжить в Telegram
        </button>
        <p>Откроем Telegram с готовым сообщением — отправка только после вашего подтверждения.</p>
      </div>
    </form>
  );
}
