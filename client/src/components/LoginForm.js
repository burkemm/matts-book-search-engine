// see SignupForm.js for comments
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
// This creates the LoginForm
const LoginForm = () => {
	// We set the variables to their default state. no input for text and false booleans are set.
	const [userFormData, setUserFormData] = useState({ email: '', password: '' });
	const [validated] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [login, { error }] = useMutation(LOGIN_USER);
	// This useEffect is for displaying alerts. IF we have an error, show an alert. If no error, then don't show an error.
	useEffect(() => {
		if (error) {
			setShowAlert(true);
		} else {
			setShowAlert(false);
		}
	}, [error]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setUserFormData({ ...userFormData, [name]: value });
	};
	// This prevents the default event to handle the formsubmit event.
	const handleFormSubmit = async (event) => {
		event.preventDefault();

		// validate if the form has all required input from the user.
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}
		// try using the input data to log in.
		try {
			const { data } = await login({
				variables: { ...userFormData },
			});
			// give the user a valid token.
			Auth.login(data.login.token);
			// if there's an error then console log the error.
		} catch (err) {
			console.error(err);
		}
		// set the default input to blank characters.
		setUserFormData({
			email: '',
			password: '',
		});
	};

	return (
		<>
			<Form noValidate validated={validated} onSubmit={handleFormSubmit}>
				<Alert
				// this shows the alert if the user wasn't validated.
					dismissible
					onClose={() => setShowAlert(false)}
					show={showAlert}
					variant="danger"
				>
					Something went wrong with your login credentials!
				</Alert>
				<Form.Group>
					<Form.Label htmlFor="email">Email</Form.Label>
					{/* If a valid email isn't given the user sees the error message below. */}
					<Form.Control
						type="text"
						placeholder="Your email"
						name="email"
						onChange={handleInputChange}
						value={userFormData.email}
						required
					/>
					<Form.Control.Feedback type="invalid">
						Email is required!
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group>
					<Form.Label htmlFor="password">Password</Form.Label>
					{/* If a valid password isn't given the user sees the error message below. */}
					<Form.Control
						type="password"
						placeholder="Your password"
						name="password"
						onChange={handleInputChange}
						value={userFormData.password}
						required
					/>
					<Form.Control.Feedback type="invalid">
						Password is required!
					</Form.Control.Feedback>
				</Form.Group>
				<Button
				// If the user provides a valid email and valid password they will see the below message.
					disabled={!(userFormData.email && userFormData.password)}
					type="submit"
					variant="success"
				>
					Submit
				</Button>
			</Form>
		</>
	);
};

export default LoginForm;
