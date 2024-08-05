import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { Container, Col, Row, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({ variables: { bookId } });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  const userData = data.me;

  return (
    <Container>
      <Row>
        {userData.savedBooks.map((book) => (
          <Col md="4" key={book.bookId}>
            <Card>
              {book.image && <Card.Img variant="top" src={book.image} />}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle>{book.authors.join(', ')}</Card.Subtitle>
                <Card.Text>{book.description}</Card.Text>
                <Button onClick={() => handleDeleteBook(book.bookId)}>Remove</Button>
                <a href={book.link} target="_blank" rel="noopener noreferrer">View on Google Books</a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedBooks;