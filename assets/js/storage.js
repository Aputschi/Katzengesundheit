/* storage.js
 * Lokale Persistenz über localStorage. Keine Server, keine Cloud –
 * alle Daten bleiben im Browser dieses Geräts.
 */
window.Store = (function () {
  var KEY = "katzengesundheit.v1";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return { cats: [], foods: [] };
      var data = JSON.parse(raw);
      if (!data.cats) data.cats = [];
      if (!data.foods) data.foods = [];
      return data;
    } catch (e) {
      console.warn("Konnte Daten nicht laden:", e);
      return { cats: [], foods: [] };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Speichern fehlgeschlagen:", e);
      return false;
    }
  }

  function uid() {
    return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* ---------- Katzen ---------- */
  function getCats() { return load().cats; }

  function getCat(id) {
    var cats = load().cats;
    for (var i = 0; i < cats.length; i++) if (cats[i].id === id) return cats[i];
    return null;
  }

  function upsertCat(cat) {
    var data = load();
    if (cat.id) {
      for (var i = 0; i < data.cats.length; i++) {
        if (data.cats[i].id === cat.id) { data.cats[i] = cat; save(data); return cat; }
      }
    }
    cat.id = uid();
    cat.createdAt = Date.now();
    data.cats.push(cat);
    save(data);
    return cat;
  }

  function deleteCat(id) {
    var data = load();
    data.cats = data.cats.filter(function (c) { return c.id !== id; });
    save(data);
  }

  /* ---------- Gespeicherte Futtersorten ---------- */
  function getFoods() { return load().foods; }

  function saveFood(food) {
    var data = load();
    food.id = food.id || ("f" + Date.now().toString(36));
    var found = false;
    for (var i = 0; i < data.foods.length; i++) {
      if (data.foods[i].id === food.id) { data.foods[i] = food; found = true; break; }
    }
    if (!found) data.foods.push(food);
    save(data);
    return food;
  }

  function deleteFood(id) {
    var data = load();
    data.foods = data.foods.filter(function (f) { return f.id !== id; });
    save(data);
  }

  /* ---------- Tagesaufgaben (Abhakliste, Reset pro Tag) ---------- */
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function getRoutineDone(catId) {
    var data = load();
    var r = (data.routine || {})[catId];
    if (!r || r.date !== todayStr()) return [];
    return r.done || [];
  }
  function toggleRoutine(catId, taskId) {
    var data = load();
    if (!data.routine) data.routine = {};
    var r = data.routine[catId];
    if (!r || r.date !== todayStr()) { r = { date: todayStr(), done: [] }; data.routine[catId] = r; }
    var i = r.done.indexOf(taskId);
    if (i >= 0) r.done.splice(i, 1); else r.done.push(taskId);
    save(data);
    return r.done;
  }

  /* ---------- Export / Import (Backup) ---------- */
  function exportJson() { return JSON.stringify(load(), null, 2); }

  function importJson(text) {
    var data = JSON.parse(text);
    if (!data.cats) data.cats = [];
    if (!data.foods) data.foods = [];
    save(data);
    return data;
  }

  return {
    getCats: getCats, getCat: getCat, upsertCat: upsertCat, deleteCat: deleteCat,
    getFoods: getFoods, saveFood: saveFood, deleteFood: deleteFood,
    getRoutineDone: getRoutineDone, toggleRoutine: toggleRoutine,
    exportJson: exportJson, importJson: importJson,
  };
})();
