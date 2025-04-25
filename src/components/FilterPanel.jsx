import React from "react"

const FilterPanel = ({
	consultationType,
	onConsultationChange,
	specialties,
	onSpecialtyChange,
	sortBy,
	onSortChange,
	availableSpecialties,
}) => {
	// Convert specialty to filter format
	const formatForTestId = (specialty) =>
		specialty.replace(/[^a-zA-Z0-9-]/g, "-")

	return (
		<div className="filter-panel">
			<div className="consultation-filter">
				<h3 data-testid="filter-header-moc">Mode of Consultation</h3>
				<label>
					<input
						type="radio"
						name="consultation"
						value="Video Consult"
						checked={consultationType === "Video Consult"}
						onChange={(e) => onConsultationChange(e.target.value)}
						data-testid="filter-video-consult"
					/>
					Video Consult
				</label>
				<label>
					<input
						type="radio"
						name="consultation"
						value="In Clinic"
						checked={consultationType === "In Clinic"}
						onChange={(e) => onConsultationChange(e.target.value)}
						data-testid="filter-in-clinic"
					/>
					In Clinic
				</label>
				{consultationType && (
					<button
						className="clear-filter"
						onClick={() => onConsultationChange("")}
					>
						Clear
					</button>
				)}
			</div>

			<div className="specialties-filter">
				<h3 data-testid="filter-header-speciality">Specialities</h3>
				{availableSpecialties.map((specialty) => (
					<label key={specialty}>
						<input
							type="checkbox"
							value={specialty}
							checked={specialties.includes(specialty)}
							onChange={() => onSpecialtyChange(specialty)}
							data-testid={`filter-specialty-${formatForTestId(specialty)}`}
						/>
						{specialty}
					</label>
				))}
				{specialties.length > 0 && (
					<button
						className="clear-filter"
						onClick={() => onSpecialtyChange("CLEAR_ALL")}
					>
						Clear All
					</button>
				)}
			</div>

			<div className="sort-filter">
				<h3 data-testid="filter-header-sort">Sort By</h3>
				<label>
					<input
						type="radio"
						name="sort"
						value="fees"
						checked={sortBy === "fees"}
						onChange={(e) => onSortChange(e.target.value)}
						data-testid="sort-fees"
					/>
					Fees (Low to High)
				</label>
				<label>
					<input
						type="radio"
						name="sort"
						value="experience"
						checked={sortBy === "experience"}
						onChange={(e) => onSortChange(e.target.value)}
						data-testid="sort-experience"
					/>
					Experience (High to Low)
				</label>
				{sortBy && (
					<button className="clear-filter" onClick={() => onSortChange("")}>
						Clear
					</button>
				)}
			</div>
		</div>
	)
}

export default FilterPanel
