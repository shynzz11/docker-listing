import React, { useState, useEffect } from "react"

const Autocomplete = ({ searchTerm, onSearch, doctors }) => {
	const [suggestions, setSuggestions] = useState([])
	const [showSuggestions, setShowSuggestions] = useState(false)

	useEffect(() => {
		if (searchTerm.trim() === "") {
			setSuggestions([])
			return
		}

		const searchLower = searchTerm.toLowerCase()
		const matches = doctors
			.filter((doctor) => doctor.name.toLowerCase().includes(searchLower))
			.slice(0, 3) // Only show top 3 matches
		setSuggestions(matches)
	}, [searchTerm, doctors])

	const handleChange = (e) => {
		onSearch(e.target.value)
		// Always show suggestions when typing
		setShowSuggestions(true)
	}

	const handleSuggestionClick = (name) => {
		onSearch(name)
		setShowSuggestions(false)
	}

	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === "Escape") {
			setShowSuggestions(false)
		}
	}

	return (
		<div className="autocomplete">
			<input
				type="text"
				value={searchTerm}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onFocus={() => setShowSuggestions(true)}
				onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
				placeholder="Search for doctors..."
				data-testid="autocomplete-input"
				aria-label="Search for doctors"
				role="combobox"
				aria-expanded={showSuggestions}
				aria-controls="search-suggestions"
				aria-autocomplete="list"
			/>
			{showSuggestions && suggestions.length > 0 && (
				<ul className="suggestions" id="search-suggestions" role="listbox">
					{suggestions.map((doc) => (
						<li
							key={doc.id}
							onClick={() => handleSuggestionClick(doc.name)}
							data-testid="suggestion-item"
							role="option"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleSuggestionClick(doc.name)
								}
							}}
						>
							{doc.name}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Autocomplete
