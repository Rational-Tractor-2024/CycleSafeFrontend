import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import './Route.css';

function Route({ source, target, setSource, setTarget, onSubmit }) {
	return (
		<Card id='side-menu'>
			<Card.Body>
				<Card.Title>Create a Route</Card.Title>


				<div className='form-box'>

					<div className='form-field'>
						<div className="form-btn">A</div>
						<Form.Control
							placeholder='From...'
							value={source}
							onChange={(e) => {
								setSource(e.target.value);
							}}

						/* aria-label="Username"
							aria-describedby="basic-addon1" */
						/>
					</div>

					<div className='form-field'>
						<div className="form-btn">B</div>
						<Form.Control
							placeholder='To...'
							value={target}
							onChange={(e) => {
								setTarget(e.target.value);
							}}
						/* aria-label="Username"
							aria-describedby="basic-addon1" */
						/>
					</div>
				</div>

				<div className='btn-box path-search-btn' onClick={onSubmit}>
					<div>Search</div>
					<div className='loader'></div>
				</div>
				
				<div className="best-route mt-5">
					<div className="h3">Best route</div>
				</div>
				
				<div className="info-1 mt-5">
					<div>65.2km</div>
					<div>5h 18min</div>
				</div>
				
				<div className="bottom-icon"></div>
				
			</Card.Body>
		</Card>
	);
}

export default Route;
