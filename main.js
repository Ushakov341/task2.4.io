const input = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const repoList = document.getElementById("repoList");

let timeoutId;

function debounce(func, delay) {
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

async function fetchRepos(query) {
  if (!query.trim()) {
    suggestions.innerHTML = "";
    return;
  }

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}`
  );
  const data = await response.json();

  suggestions.innerHTML = "";

  const repos = data.items.slice(0, 5);
  repos.forEach((repo) => {
    const item = document.createElement("div");
    item.classList.add("suggestion-item");
    item.textContent = repo.name;
    item.addEventListener("click", () => {
      addRepo(repo);
      input.value = "";
      suggestions.innerHTML = "";
    });
    suggestions.appendChild(item);
  });
}

const debouncedFetchRepos = debounce(fetchRepos, 500);

input.addEventListener("input", (e) => {
  const query = e.target.value;
  if (query.trim() === "") {
    suggestions.innerHTML = "";
    return;
  }
  debouncedFetchRepos(query);
});

function addRepo(repo) {
  const item = document.createElement("div");
  item.classList.add("repo-item");

  item.innerHTML = `
        <div>Name: ${repo.name}</div>
        <div>Owner: ${repo.owner.login}</div>
        <div>Stars: ${repo.stargazers_count}</div>
        <div class="delete-btn">×</div>
      `;

  item.querySelector(".delete-btn").addEventListener("click", () => {
    item.remove();
  });

  repoList.appendChild(item);
}
