import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) return false;
    try {
      const response = await searchGoogleBooks(searchInput);
      if (!response.ok) throw new Error('something went wrong!');
      const { items } = await response.json();
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.canonicalVolumeLink || ''
      }));
      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;
    try {
      const { data } = await saveBook({
        variables: {
          bookId: bookToSave.bookId,
          authors: bookToSave.authors,
          description: bookToSave.description,
          title: bookToSave.title,
          image: bookToSave.image,
          link: bookToSave.link
        }
      });
      if (!data) throw new Error('something went wrong!');
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Row>
        <Col md="12">
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search for a book"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" variant="primary">Submit</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        {searchedBooks.map((book) => (
          <Col md="4" key={book.bookId}>
            <Card>
              {book.image && <Card.Img variant="top" src={book.image} />}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle>{book.authors.join(', ')}</Card.Subtitle>
                <Card.Text>{book.description}</Card.Text>
                <Button
                  disabled={savedBookIds.includes(book.bookId)}
                  onClick={() => handleSaveBook(book.bookId)}
                >
                  {savedBookIds.includes(book.bookId) ? 'Book Already Saved' : 'Save This Book!'}
                </Button>
                <a href={book.link} target="_blank" rel="noopener noreferrer">View on Google Books</a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SearchBooks;