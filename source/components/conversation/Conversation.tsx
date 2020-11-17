import { goToQuestion, validateStepWithValue } from 'Actions/actions'
import { T } from 'Components'
import QuickLinks from 'Components/QuickLinks'
import getInputComponent from 'Engine/getInputComponent'
import { findRuleByDottedName } from 'Engine/rules'
import React, { useState, useEffect, useContext } from 'react'
import { TrackerContext } from 'Components/utils/withTracker'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import {
	currentQuestionSelector,
	flatRulesSelector,
	nextStepsSelector,
	analysisWithDefaultsOnlySelector,
} from 'Selectors/analyseSelectors'
import * as Animate from 'Ui/animate'
import Aide from './Aide'
import './conversation.css'
import { createSelector } from 'reselect'
import { head, sortBy } from 'ramda'
import Controls from 'Components/Controls'
import CategoryRespiration from './CategoryRespiration'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
}

const orderedCurrentQuestionSelector = createSelector(
	[
		analysisWithDefaultsOnlySelector,
		nextStepsSelector,
		(state) => state.conversationSteps.unfoldedStep,
	],
	(analysis, nextSteps, unfoldedStep) => {
		const firstTargetFormula = analysis.targets[0].formule.explanation,
			isSum = firstTargetFormula.name === 'somme',
			currentQuestion = unfoldedStep || head(nextSteps)

		if (!isSum) return currentQuestion
		try {
			const items = firstTargetFormula.explanation
			const sortedSteps = sortBy(
				(question) =>
					-items.find((item) => question.indexOf(item.dottedName) === 0)
						?.nodeValue,
				nextSteps
			)
			return unfoldedStep || head(sortedSteps)
		} catch (e) {
			console.log(e)
			return currentQuestion
		}
	}
)

export default function Conversation({
	customEndMessages,
	customEnd,
	teaseCategories,
}: ConversationProps) {
	const [dismissedRespirations, dismissRespiration] = useState([])
	const dispatch = useDispatch()
	const flatRules = useSelector(flatRulesSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const previousAnswers = useSelector(
		(state: RootState) => state.conversationSteps.foldedSteps
	)
	const nextSteps = useSelector(nextStepsSelector)

	const tracker = useContext(TrackerContext)

	useEffect(() => {
		if (previousAnswers.length === 1) {
			tracker.push(['trackEvent', 'NGC', '1ère réponse au bilan'])
		}
	}, [previousAnswers, tracker])

	const setDefault = () =>
		dispatch(
			validateStepWithValue(
				currentQuestion,
				findRuleByDottedName(flatRules, currentQuestion).defaultValue
			)
		)
	const goToPrevious = () =>
		dispatch(goToQuestion(previousAnswers.slice(-1)[0]))
	const handleKeyDown = ({ key }: React.KeyboardEvent) => {
		if (['Escape'].includes(key)) {
			setDefault()
		}
	}
	const questionCategory =
		currentQuestion &&
		findRuleByDottedName(flatRules, currentQuestion.split(' . ')[0])

	const firstCategoryQuestion =
		questionCategory &&
		previousAnswers.find(
			(a) => a.split(' . ')[0] === questionCategory.dottedName
		) === undefined

	return teaseCategories &&
		firstCategoryQuestion &&
		!dismissedRespirations.includes(questionCategory.dottedName) ? (
		<CategoryRespiration
			questionCategory={questionCategory}
			dismiss={() => dismissRespiration(questionCategory.dottedName)}
		/>
	) : (
		<section className="ui__ full-width lighter-bg">
			<div className="ui__ container">
				<Controls />
				{nextSteps.length ? (
					<>
						<Aide />
						<div
							tabIndex={0}
							style={{ outline: 'none' }}
							onKeyDown={handleKeyDown}
						>
							{currentQuestion && (
								<React.Fragment key={currentQuestion}>
									{teaseCategories && questionCategory && (
										<div>
											<span
												css={`
													background: ${questionCategory.couleur || 'darkblue'};
													color: white;
													border-radius: 0.3rem;
													padding: 0.15rem 0.6rem;
													text-transform: uppercase;
													img {
														margin: 0 0.6rem 0 0 !important;
													}
												`}
											>
												{emoji(questionCategory.icônes || '🌍')}
												{questionCategory.title}
											</span>
										</div>
									)}
									<Animate.fadeIn>
										{getInputComponent(flatRules)(currentQuestion)}
									</Animate.fadeIn>
									<div className="ui__ answer-group">
										{previousAnswers.length > 0 && (
											<>
												<button
													onClick={goToPrevious}
													className="ui__ simple small push-left button"
												>
													← <T>Précédent</T>
												</button>
											</>
										)}
										<button
											onClick={setDefault}
											className="ui__ simple small push-right button"
										>
											<T>Je ne sais pas</T> →
										</button>
									</div>
								</React.Fragment>
							)}
						</div>
						<QuickLinks />
					</>
				) : (
					<div style={{ textAlign: 'center' }}>
						{customEnd || (
							<>
								<EndingCongratulations />
								<p>
									{customEndMessages ? (
										customEndMessages
									) : (
										<T k="simulation-end.text">
											Vous avez maintenant accès à l'estimation la plus précise
											possible.
										</T>
									)}
								</p>
								<button
									className="ui__ small simple  button "
									onClick={resetSimulation}
								>
									<T>Recommencer</T>
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</section>
	)
}

export let EndingCongratulations = () => (
	<h3>
		{emoji('🌟')}{' '}
		<T k="simulation-end.title">Vous avez complété cette simulation</T>{' '}
	</h3>
)
