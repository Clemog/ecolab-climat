import { setSimulationConfig } from 'Actions/actions'
import { EndingCongratulations } from 'Components/conversation/Conversation'
import PeriodSwitch from 'Components/PeriodSwitch'
import ShareButton from 'Components/ShareButton'
import Simulation from 'Components/Simulation'
import { Markdown } from 'Components/utils/markdown'
import { decodeRuleName, findRuleByDottedName } from 'Engine/rules'
import React, { useEffect, useContext } from 'react'
import { TrackerContext } from 'Components/utils/withTracker'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import {
	flatRulesSelector,
	analysisWithDefaultsSelector,
} from 'Selectors/analyseSelectors'
import CarbonImpact from './CarbonImpact'
import withTarget from './withTarget'
import Chart from './chart/index.js'
import { Redirect } from 'react-router'
import SessionBar from 'Components/SessionBar'
import { isEmpty, symmetricDifference, compose } from 'ramda'
import { buildEndURL } from 'Components/SessionBar'

let CarbonImpactWithData = withTarget(CarbonImpact)
const eqValues = compose(isEmpty, symmetricDifference)

const Simulateur = (props) => {
	const objectif = props.match.params.name,
		decoded = decodeRuleName(objectif),
		rules = useSelector(flatRulesSelector),
		rule = findRuleByDottedName(rules, decoded),
		analysis = useSelector(analysisWithDefaultsSelector),
		dispatch = useDispatch(),
		config = {
			objectifs: [decoded],
		},
		configSet = useSelector((state) => state.simulation?.config)
	useEffect(
		() =>
			!eqValues(config.objectifs, configSet?.objectifs || [])
				? dispatch(setSimulationConfig(config))
				: () => null,
		[]
	)

	if (!configSet) return null

	return (
		<div css="margin-bottom: 1em">
			<Helmet>
				<title>{rule.title}</title>
				{rule.description && (
					<meta name="description" content={rule.description} />
				)}
			</Helmet>
			<SessionBar />
			<Simulation
				noFeedback
				teaseCategories
				noProgressMessage
				showConversation
				customEnd={
					rule.dottedName === 'bilan' ? (
						<RedirectionToEndPage score={rule.nodeValue} url={buildEndURL(analysis)} />
					) : rule.description ? (
						<Markdown source={rule.description} />
					) : (
						<EndingCongratulations />
					)
				}
				targets={<>{rule.period === 'flexible' && <PeriodBlock />}</>}
				explanations={
					<>
						<CarbonImpactWithData />
						<Chart />
					</>
				}
			/>
		</div>
	)
}

let PeriodBlock = () => (
	<div css="display: flex; justify-content: center">
		<PeriodSwitch />
	</div>
)

const RedirectionToEndPage = ({ url, score }) => {
	const tracker = useContext(TrackerContext)

	useEffect(() => {
		tracker.push(['trackEvent', 'NGC', 'A terminé la simulation', null, score])
	}, [tracker])

	return <Redirect to={url} />
}

export default Simulateur
