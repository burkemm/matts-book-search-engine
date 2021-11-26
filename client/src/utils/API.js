// This is the route to get a logged in user's information. A token is required.
export const getMe = (token) => {
	return fetch('/api/users/me', {
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
	});
};

export const createUser = (userData) => {
	return fetch('/api/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	});
};

export const loginUser = (userData) => {
	return fetch('/api/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(userData),
	});
};

// This saves book data for a user (logged in).
export const saveBook = (bookData, token) => {
	return fetch('/api/users', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(bookData),
	});
};

// This deletes book data for a user (logged in).
export const deleteBook = (bookId, token) => {
	return fetch(`/api/users/books/${bookId}`, {
		method: 'DELETE',
		headers: {
			authorization: `Bearer ${token}`,
		},
	});
};

// This creates a search to books on the google api.
export const searchGoogleBooks = (query) => {
	return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
