import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import Simu from 'Components/Simu'
import React from 'react'
import Marianne from 'Images/marianne.svg'
import URSSAF from 'Images/urssaf.svg'
import './Home.css'

const Home = () => (
	<div id="home" className="ui__ container">
		<PreviousSimulationBanner />
		<Simu />
		<div id="logos">
			<a
				id="marianne"
				href="https://beta.gouv.fr"
				target="_blank"
				rel="noopener noreferrer">
				<img src={Marianne} alt="Un service de l'État français" />
			</a>
			<a
				id="urssaf"
				href="https://www.urssaf.fr"
				target="_blank"
				rel="noopener noreferrer">
				<img src={URSSAF} alt="Un service des URSSAF" />
			</a>
		</div>
	</div>
)

export default Home
