document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const repoList = document.getElementById('repos-list');
  
    const GITHUB_API_BASE = 'https://api.github.com';
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const searchQuery = searchInput.value.trim();
      if (searchQuery) {
        searchUsers(searchQuery);
        userList.innerHTML = '';
        repoList.innerHTML = '';
      }
    });
  
    function searchUsers(query) {
      fetch(`${GITHUB_API_BASE}/search/users?q=${query}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      })
        .then((response) => response.json())
        .then((data) => renderUserResults(data.items))
        .catch((error) => console.error('Error fetching users:', error));
    }
  
    function renderUserResults(users) {
      users.forEach((user) => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" width="50">
          <a href="${user.html_url}" target="_blank">${user.login}</a>
          <button data-username="${user.login}">View Repos</button>
        `;
        const repoButton = userItem.querySelector('button');
        repoButton.addEventListener('click', () => fetchUserRepos(user.login));
        userList.appendChild(userItem);
      });
    }
  
    function fetchUserRepos(username) {
      fetch(`${GITHUB_API_BASE}/users/${username}/repos`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      })
        .then((response) => response.json())
        .then((repos) => renderRepoResults(repos))
        .catch((error) => console.error('Error fetching repos:', error));
    }
  
    function renderRepoResults(repos) {
      repoList.innerHTML = ''; // Clear previous results
      repos.forEach((repo) => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        `;
        repoList.appendChild(repoItem);
      });
    }
  });
  