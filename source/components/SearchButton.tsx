import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import Overlay from './Overlay'
import SearchBar from './SearchBar'

type SearchButtonProps = {
	invisibleButton?: boolean
}

export default function SearchButton({ invisibleButton }: SearchButtonProps) {
	const flatRules = useSelector(flatRulesSelector)
	const [visible, setVisible] = useState(false)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!(e.ctrlKey && e.key === 'k')) return
			setVisible(true)
			e.preventDefault()
			e.stopPropagation()
			return false
		}
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const close = () => setVisible(false)

	return visible ? (
		<Overlay onClose={close}>
			<h2>
				<Trans>Chercher dans la documentation</Trans>
			</h2>
			<SearchBar
				showDefaultList={false}
				finallyCallback={close}
				rules={flatRules}
			/>
		</Overlay>
	) : invisibleButton ? null : (
		<button
			className="ui__ simple small button"
			onClick={() => setVisible(true)}
		>
			{emoji('🔍')} <Trans>Rechercher</Trans>
		</button>
	)
}
