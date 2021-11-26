import React, { useState, useEffect } from 'react';
import {
	Jumbotron,
	Container,
	Col,
	Form,
	Button,
	Card,
	CardColumns,
} from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
// This is for book searches.
const SearchBooks = () => {
	const [searchedBooks, setSearchedBooks] = useState([]);
	const [searchInput, setSearchInput] = useState('');
	const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

	const [saveBook, { error }] = useMutation(SAVE_BOOK);
	// This returns the saved book ids by useEffect.
	useEffect(() => {
		return () => saveBookIds(savedBookIds);
	});
	// this handles the form submit with if statements and try/catch statements.
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		// If no search input, then return false boolean.
		if (!searchInput) {
			return false;
		}
		// fetch the google api.
		try {
			const response = await fetch(
				`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`
			);
			// If there's no response, then throw an error message.
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}
			const { items } = await response.json();
			// map the bookData by bookid, authors, title, description, and image.
			const bookData = items.map((book) => ({
				bookId: book.id,
				authors: book.volumeInfo.authors || ['No author to display'],
				title: book.volumeInfo.title,
				description: book.volumeInfo.description,
				image: book.volumeInfo.imageLinks?.thumbnail || '',
			}));

			setSearchedBooks(bookData);
			setSearchInput('');
		} catch (err) {
			console.error(err);
		}
	};
	// This is for handling books to save.
	const handleSaveBook = async (bookId) => {
		// This variable finds searchedbooks by matching bookid to the book.bookid.
		const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
		// This gets a valid token.
		const token = Auth.loggedIn() ? Auth.getToken() : null;
		// IF there's no token then set to false boolean.
		if (!token) {
			return false;
		}
		// Try to use the data to find the saved book
		try {
			const { data } = await saveBook({
				variables: { newBook: { ...bookToSave } },
			});

			setSavedBookIds([...savedBookIds, bookToSave.bookId]);
		} catch (err) {
			console.error(err);
		}
	};
	// this returns the books from the search.
	return (
		<>
			<Jumbotron fluid className="text-light bg-dark">
				<Container>
					<h1>Search for Books!</h1>
					<Form onSubmit={handleFormSubmit}>
						<Form.Row>
							<Col xs={12} md={8}>
								<Form.Control
									name="searchInput"
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									type="text"
									size="lg"
									placeholder="Search for a book"
								/>
							</Col>
							<Col xs={12} md={4}>
								<Button type="submit" variant="success" size="lg">
									Submit Search
								</Button>
							</Col>
						</Form.Row>
					</Form>
				</Container>
			</Jumbotron>

			<Container>
				<h2>
					{searchedBooks.length
						? `Viewing ${searchedBooks.length} results:`
						: 'Search for a book to begin'}
				</h2>
				<CardColumns>
					{searchedBooks.map((book) => {
						return (
							<Card key={book.bookId} border="dark">
								{book.image ? (
									<Card.Img
										src={book.image}
										alt={`The cover for ${book.title}`}
										variant="top"
									/>
								) : null}
								<Card.Body>
									<Card.Title>{book.title}</Card.Title>
									<p className="small">Authors: {book.authors}</p>
									<Card.Text>{book.description}</Card.Text>
									{Auth.loggedIn() && (
										<Button
											disabled={savedBookIds?.some(
												(savedBookId) => savedBookId === book.bookId
											)}
											className="btn-block btn-info"
											onClick={() => handleSaveBook(book.bookId)}
										>
											{savedBookIds?.some(
												(savedBookId) => savedBookId === book.bookId
											)
												? 'This book has already been saved!'
												: 'Save this Book!'}
										</Button>
									)}
								</Card.Body>
							</Card>
						);
					})}
				</CardColumns>
			</Container>
		</>
	);
};

export default SearchBooks;
