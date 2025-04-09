import { useState } from 'react'

const emptyOptions = ['', '']

export default function DecisionForm({ onCancel, onSave }) {
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [why, setWhy] = useState('')
  const [options, setOptions] = useState(emptyOptions)
  const [error, setError] = useState('')

  function updateOption(index, value) {
    setOptions((current) => current.map((item, i) => (i === index ? value : item)))
  }

  function addOption() {
    setOptions((current) => (current.length >= 5 ? current : [...current, '']))
  }

  function removeOption(index) {
    setOptions((current) => (current.length <= 2 ? current : current.filter((_, i) => i !== index)))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    const cleanOptions = options.map((item) => item.trim()).filter(Boolean)

    if (!cleanTitle) {
      setError('Нужен заголовок.')
      return
    }
    if (cleanOptions.length < 2) {
      setError('Добавьте хотя бы два варианта.')
      return
    }
    if (cleanOptions.length > 5) {
      setError('Не больше пяти вариантов.')
      return
    }

    onSave({
      title: cleanTitle,
      context: context.trim(),
      why: why.trim(),
      options: cleanOptions,
    })
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <label>
        Заголовок
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Например: какой ноутбук купить"
        />
      </label>
      <label>
        Контекст
        <textarea
          value={context}
          onChange={(event) => setContext(event.target.value)}
          placeholder="Что происходит и какие ограничения"
        />
      </label>
      <div>
        <label>Варианты (2–5)</label>
        {options.map((option, index) => (
          <div className="option-row" key={index}>
            <input
              type="text"
              value={option}
              onChange={(event) => updateOption(index, event.target.value)}
              placeholder={`Вариант ${index + 1}`}
            />
            {options.length > 2 ? (
              <button type="button" className="btn ghost" onClick={() => removeOption(index)}>
                Убрать
              </button>
            ) : null}
          </div>
        ))}
        {options.length < 5 ? (
          <button type="button" className="btn secondary" onClick={addOption}>
            Добавить вариант
          </button>
        ) : null}
      </div>
      <label>
        Почему так думаю
        <textarea
          value={why}
          onChange={(event) => setWhy(event.target.value)}
          placeholder="Критерии, сомнения, что важно не забыть"
        />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <div className="actions">
        <button type="submit" className="btn">
          Сохранить
        </button>
        <button type="button" className="btn secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  )
}
