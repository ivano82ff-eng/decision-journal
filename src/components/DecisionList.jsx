const STATUS_LABELS = {
  open: 'Открыто',
  chosen: 'Выбрано',
  revisited: 'Пересмотрено',
}

function formatDate(value) {
  return new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function DecisionList({
  items,
  hasAny,
  query,
  status,
  onQuery,
  onStatus,
  onOpen,
  onCreate,
}) {
  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'open', label: 'Открыто' },
    { id: 'chosen', label: 'Выбрано' },
    { id: 'revisited', label: 'Пересмотрено' },
  ]

  return (
    <section>
      <div className="toolbar">
        <input
          className="search"
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Поиск по заголовку и контексту"
        />
        <div className="filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`chip ${status === filter.id ? 'active' : ''}`}
              onClick={() => onStatus(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="panel empty">
          <h2>{hasAny ? 'Ничего не найдено' : 'Пока пусто'}</h2>
          <p>
            {hasAny
              ? 'Сбросьте фильтр или измените поисковый запрос.'
              : 'Запишите первое решение — потом проще понять, почему выбрали именно так.'}
          </p>
          {hasAny ? null : (
            <button type="button" className="btn" onClick={onCreate}>
              Новое решение
            </button>
          )}
        </div>
      ) : (
        <div className="list">
          {items.map((item) => (
            <button key={item.id} type="button" className="card" onClick={() => onOpen(item.id)}>
              <div className="card-head">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.context || 'Без контекста'}</p>
                </div>
                <span className={`badge ${item.status}`}>{STATUS_LABELS[item.status]}</span>
              </div>
              <div className="meta">
                {item.options.length} варианта · {formatDate(item.createdAt)}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
