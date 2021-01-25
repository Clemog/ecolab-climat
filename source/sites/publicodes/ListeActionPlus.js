import { EngineContext } from 'Components/utils/EngineContext'
import { ScrollToTop } from 'Components/utils/Scroll'
import { utils } from 'publicodes'
import { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default () => {
	const rules = useContext(EngineContext).getParsedRules()
	const plusListe = Object.entries(rules)
		.map(([dottedName, rule]) => ({ ...rule, dottedName }))
		.filter((r) => r.plus)

	return (
		<div className="ui__ container">
			<ScrollToTop />
			<h1>
				Nos explications complètes{' '}
				<img src="https://img.shields.io/badge/-beta-purple" />
			</h1>
			<p>
				<em>
					Découvrez les enjeux qui se cachent derrière chaque action.
				</em>
			</p>
			<ul
				css={`
					list-style-type: none;
					display: flex;
					flex-wrap: wrap;
					li {
						margin: 0.6rem;
						text-align: center;
					}
					li > a {
						text-decoration: none;
					}
				`}
			>
				{plusListe.map(({ dottedName, icons, title }) => (
					<li key={dottedName}>
						<Link to={'/actions/plus/' + utils.encodeRuleName(dottedName)}>
							<div
								className="ui__ card"
								css={`
									display: flex;
									flex-direction: column;
									justify-content: space-evenly;
									width: 12rem;
									height: 10rem;
									img {
										font-size: 150%;
									}
								`}
							>
								<div>{emoji(icons || '🎯')}</div>
								<div>{title}</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
