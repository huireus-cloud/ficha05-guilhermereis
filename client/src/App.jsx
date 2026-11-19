import { useState, useEffect } from "react";
import Card from "./Card.jsx";

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Criatura");
  const [attack, setAttack] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/cartas")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setCards(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  function pickRandom() {
    if (cards.length === 0) return;
    setRandomCard(cards[Math.floor(Math.random() * cards.length)]);
  }

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3000/api/cartas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, attack: Number(attack) }),
    })
      .then((res) => res.json())
      .then((card) => {
        setCards((current) => [...current, card]);
        setName("");
        setType("Criatura");
        setAttack("");
      });
  }

  if (loading) {
    return (
      <main>
        <h1>A minha coleção</h1>
        <p>A carregar…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>A minha coleção</h1>
        <p>Não foi possível carregar as cartas. Erro: {error}</p>
      </main>
    );
  }
  return (
    <main>
      <h1>A minha coleção</h1>

      <p>
        Tenho {cards.length} cartas · a mostrar {visible.length}
      </p>

      <div>
        <button onClick={() => setFilter("Todas")}>Todas</button>
        <button onClick={() => setFilter("Criatura")}>Só criaturas</button>
        <button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar pelo nome…"
      />
      <h2>Nova carta</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
        />{" "}
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Criatura">Criatura</option>
          <option value="Feitiço">Feitiço</option>
        </select>{" "}
        <input
          type="number"
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
          placeholder="Ataque"
        />{" "}
        <button type="submit">Acrescentar</button>
      </form>

      {visible.length === 0 ? (
        <p>Nenhuma carta corresponde.</p>
      ) : (
        <ul>
          {visible.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </ul>
      )}
      <h2>Carta à sorte</h2>
      <button onClick={pickRandom}>Escolher outra</button>
      {randomCard && (
        <p>
          <b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack} ·
          defesa {randomCard.defense}
        </p>
      )}
    </main>
  );
}
export default App;