import { gql } from '@apollo/client';
// This exports the GET_ME gql file
export const GET_ME = gql`
	{
		me {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				authors
				description
				title
				image
				link
			}
		}
	}
`;
