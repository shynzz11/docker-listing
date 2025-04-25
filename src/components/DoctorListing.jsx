import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import Autocomplete from "./Autocomplete"
import FilterPanel from "./FilterPanel"
import DoctorList from "./DoctorList"
import "./DoctorListing.css"

const DoctorListing = () => {
	const [doctors, setDoctors] = useState([])
	const [filteredDoctors, setFilteredDoctors] = useState([])
	const [searchTerm, setSearchTerm] = useState("")
	const [consultationType, setConsultationType] = useState("")
	const [specialties, setSpecialties] = useState([])
	const [sortBy, setSortBy] = useState("")
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()
	const location = useLocation()

	// Extract unique specialties from the API data
	const getUniqueSpecialties = useCallback((doctorsList) => {
		const specialtiesSet = new Set()
		doctorsList.forEach((doctor) => {
			if (Array.isArray(doctor.specialities)) {
				doctor.specialities.forEach((spec) => {
					const specialtyName = typeof spec === "object" ? spec.name : spec
					specialtiesSet.add(specialtyName)
				})
			}
		})
		return Array.from(specialtiesSet).sort()
	}, [])

	// Separate URL param handling from data fetching
	useEffect(() => {
		setIsLoading(true)
		axios
			.get("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json", {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const doctorsData = response.data
				setDoctors(doctorsData)
				setFilteredDoctors(doctorsData)
				setIsLoading(false)
			})
			.catch((error) => {
				console.error("Error fetching data:", error)
				setIsLoading(false)
				// Show error state to user
				setDoctors([])
				setFilteredDoctors([])
			})
	}, [])

	const updateURL = useCallback(
		(search, consult, specs, sort) => {
			const params = new URLSearchParams()
			if (search) params.set("search", search)
			if (consult) params.set("consultation", consult)
			if (specs.length > 0) params.set("specialties", specs.join(","))
			if (sort) params.set("sort", sort)
			// Use push instead of replace to maintain history
			navigate(`?${params.toString()}`)
		},
		[navigate]
	)

	const applyFilters = useCallback(
		(search, consult, specs, sort) => {
			let result = [...doctors]

			// Apply search filter
			if (search) {
				const searchLower = search.toLowerCase()
				result = result.filter((doctor) =>
					doctor.name.toLowerCase().includes(searchLower)
				)
			}

			// Apply consultation type filter
			if (consult) {
				result = result.filter((doctor) => {
					if (consult === "Video Consult") return doctor.video_consult
					if (consult === "In Clinic") return doctor.in_clinic
					return true
				})
			}

			// Apply specialties filter
			if (specs.length > 0) {
				result = result.filter((doctor) =>
					specs.every((spec) =>
						doctor.specialities.some((docSpec) => {
							const docSpecName =
								typeof docSpec === "object" ? docSpec.name : docSpec
							return docSpecName.toLowerCase() === spec.toLowerCase()
						})
					)
				)
			}

			// Apply sorting
			if (sort) {
				result.sort((a, b) => {
					if (sort === "fees") {
						// Extract numeric values from fees strings (e.g., "₹ 500" -> 500)
						const feeA = parseInt(String(a.fees).replace(/[^0-9]/g, "")) || 0
						const feeB = parseInt(String(b.fees).replace(/[^0-9]/g, "")) || 0
						return feeA - feeB
					}
					if (sort === "experience") {
						// Extract numeric values from experience strings (e.g., "13 Years of experience" -> 13)
						const expA =
							parseInt(String(a.experience).replace(/[^0-9]/g, "")) || 0
						const expB =
							parseInt(String(b.experience).replace(/[^0-9]/g, "")) || 0
						return expB - expA // Higher experience first
					}
					return 0
				})
			}

			setFilteredDoctors(result)
			updateURL(search, consult, specs, sort)
		},
		[doctors, updateURL]
	)

	// Handle URL parameters changes (including browser navigation)
	useEffect(() => {
		if (!doctors.length) return // Wait for doctors data to be loaded

		const params = new URLSearchParams(location.search)
		const search = params.get("search") || ""
		const consult = params.get("consultation") || ""
		const specs = params.get("specialties")?.split(",").filter(Boolean) || []
		const sort = params.get("sort") || ""

		setSearchTerm(search)
		setConsultationType(consult)
		setSpecialties(specs)
		setSortBy(sort)
		applyFilters(search, consult, specs, sort)
	}, [location.search, doctors, applyFilters])

	const handleSearch = (term) => {
		setSearchTerm(term)
		applyFilters(term, consultationType, specialties, sortBy)
	}

	const handleConsultationChange = (type) => {
		setConsultationType(type)
		applyFilters(searchTerm, type, specialties, sortBy)
	}

	const handleSpecialtyChange = (spec) => {
		let newSpecialties
		if (spec === "CLEAR_ALL") {
			newSpecialties = []
		} else {
			newSpecialties = specialties.includes(spec)
				? specialties.filter((s) => s !== spec)
				: [...specialties, spec]
		}
		setSpecialties(newSpecialties)
		applyFilters(searchTerm, consultationType, newSpecialties, sortBy)
	}

	const handleSortChange = (sort) => {
		setSortBy(sort)
		applyFilters(searchTerm, consultationType, specialties, sort)
	}

	if (isLoading) {
		return <div className="loading">Loading doctors...</div>
	}

	return (
		<div className="doctor-listing">
			<Autocomplete
				searchTerm={searchTerm}
				onSearch={handleSearch}
				doctors={doctors}
			/>
			<div className="content">
				<FilterPanel
					consultationType={consultationType}
					onConsultationChange={handleConsultationChange}
					specialties={specialties}
					onSpecialtyChange={handleSpecialtyChange}
					sortBy={sortBy}
					onSortChange={handleSortChange}
					availableSpecialties={getUniqueSpecialties(doctors)}
				/>
				<DoctorList doctors={filteredDoctors} />
			</div>
		</div>
	)
}

export default DoctorListing
