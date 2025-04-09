const STATUS_LABELS = {
  open: 'Открыто',
  chosen: 'Выбрано',
  revisited: 'Пересмотрено',
}

function formatDate(value) {
  return new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DecisionDetail({ decision, onBack, onChoose, onStatus, onDelete }) {
  return (
    <article className="panel detail">
      <button type="button" className="btn ghost" onClick={onBack}>
        ← К списку
      </button>
      <div className="card-head">
        <h2>{decision.title}</h2>
        <span className={`badge ${decision.status}`}>{STATUS_LABELS[decision.status]}</span>
      </div>
      <p className="meta">Создано {formatDate(decision.createdAt)}</p>
      <p className="context">{decision.context || 'Контекст не указан.'}</p>
      {decision.why ? (
        <p>
          <strong>Почему: </strong>
          {decision.why}
        </p>
      ) : null}

      <div className="options">
        {decision.options.map((option) => {
          const selected = option.id === decision.chosenOptionId
          return (
            <div key={option.id} className={`option ${selected ? 'selected' : ''}`}>
              <span>{option.text}</span>
              <button type="button" className="btn secondary" onClick={() => onChoose(option.id)}>
                {selected ? 'Выбрано' : 'Выбрать'}
              </button>
            </div>
          )
        })}
      </div>

      <label>
        Статус
        <select value={decision.status} onChange={(event) => onStatus(event.target.value)}>
          <option value="open">Открыто</option>
          <option value="chosen">Выбрано</option>
          <option value="revisited">Пересмотрено</option>
        </select>
      </label>

      <div className="actions">
        <button type="button" className="btn danger" onClick={onDelete}>
          Удалить
        </button>
      </div>
    </article>
  )
}
