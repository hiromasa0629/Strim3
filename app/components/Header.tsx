import React from 'react'
import { Row, Col } from 'react-bootstrap';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
	return (
		<Row className="justify-content-between">
			<Col xs="auto">
				<h3>Strim3</h3>
			</Col>
			<Col xs="auto">
				<ConnectButton
					accountStatus={"full"}
					chainStatus={"icon"}
					showBalance={true}
				/>
			</Col>
		</Row>
	)
}

export default Header