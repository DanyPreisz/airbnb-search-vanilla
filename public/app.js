const form = document.querySelector("#form");
const grid = document.querySelector("#grid");
const count = document.querySelector("#count");
const modal = document.querySelector("#modal");
const detail = document.querySelector("#detail");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  load();
});

document.querySelector("#close").addEventListener("click", () => {
  modal.hidden = true;
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.hidden = true;
});

grid.addEventListener("click", async (event) => {
  const btn = event.target.closest("[data-id]");
  if (!btn) return;
  const s = await (await fetch("/api/stays/" + btn.dataset.id)).json();
  detail.innerHTML = `<h2>${s.title}</h2><p>${s.city} · ${s.type}</p><p>USD ${s.price} / noche · ${s.guests} huéspedes · ★ ${s.rating}</p>`;
  modal.hidden = false;
});

async function load() {
  const q = document.querySelector("#q").value;
  const guests = document.querySelector("#guests").value;
  const max = document.querySelector("#max").value;
  const url = `/api/stays?q=${encodeURIComponent(q)}&guests=${guests}&max=${max}`;
  const list = await (await fetch(url)).json();
  count.textContent = `${list.length} lugares`;
  grid.innerHTML = list
    .map(
      (s) =>
        `<button class="card" data-id="${s.id}"><small>${s.city}</small>${s.title}<small>USD ${s.price} · ${s.guests} pers. · ★ ${s.rating}</small></button>`
    )
    .join("");
}

load();
