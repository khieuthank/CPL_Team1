import style from '../components/articles/Articles.module.css';

export function formatDate(isoDateString) {
  const date = new Date(isoDateString);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return date.toLocaleDateString('en-US', options);
}

export const handleFavoriteRender = (favorite, slug, index) => {
  const favoriteCountElement = document.querySelector(`#fe${index}`);
  const storedToken = localStorage.getItem('token');
  const apiUrl = `https://api.realworld.io/api/articles/${slug}/favorite`;

  if (storedToken == null) {
    window.location.href = "/users/login";  
  } else {
    if (favoriteCountElement.classList.value === '') {
      const newData = {
        article: {
          favoritesCount: favorite + 1
        }
      };

      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${storedToken}`
        },
        body: JSON.stringify(newData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          favoriteCountElement.innerHTML = `<i class="fa-solid fa-heart"></i> ${data.article.favoritesCount}`;
          favoriteCountElement.classList.add(style.btnAdd);
        })
        .catch(error => {
          console.error('Có lỗi xảy ra khi cập nhật:', error);
        });
    } else {
      fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${storedToken}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          favoriteCountElement.innerHTML = `<i class="fa-solid fa-heart"></i> ${data.article.favoritesCount}`;
          favoriteCountElement.classList.remove(style.btnAdd);
          console.log(data);
        })
        .catch(error => {
          console.error('Error occurred while updating favorite:', error);
        });
    }
  }
};
