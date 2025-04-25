import React from "react"

const DoctorList = ({ doctors }) => {
	return (
		<div className="doctor-list">
			{doctors.length === 0 ? (
				<div className="no-results">
					No doctors found matching your criteria
				</div>
			) : (
				doctors.map((doctor) => (
					<div
						key={doctor.id}
						className="doctor-card"
						data-testid="doctor-card"
					>
						<div className="doctor-header">
							<div className="doctor-photo">
								<img src={doctor.photo} alt={doctor.name} />
								<div className="initials">{doctor.name_initials}</div>
							</div>
							<div className="doctor-info">
								<h4 data-testid="doctor-name">{doctor.name}</h4>
								<p data-testid="doctor-specialty" className="specialties">
									<strong>Specialties:</strong>{" "}
									{Array.isArray(doctor.specialities)
										? doctor.specialities
												.map((spec) =>
													typeof spec === "object" ? spec.name : spec
												)
												.join(", ")
										: "Not specified"}
								</p>
								<p data-testid="doctor-experience" className="experience">
									<strong>Experience:</strong> {doctor.experience}
								</p>
								<p data-testid="doctor-fee" className="fees">
									<strong>Consultation Fee:</strong> {doctor.fees}
								</p>
							</div>
						</div>

						<div className="doctor-detail">
							<p className="introduction">{doctor.doctor_introduction}</p>

							{doctor.languages && doctor.languages.length > 0 && (
								<p className="languages">
									<strong>Languages:</strong> {doctor.languages.join(", ")}
								</p>
							)}
						</div>

						{doctor.clinic && (
							<div className="clinic-info">
								<div className="clinic-header">
									{doctor.clinic.logo_url && (
										<img
											src={doctor.clinic.logo_url}
											alt={doctor.clinic.name}
											className="clinic-logo"
										/>
									)}
									<h5>{doctor.clinic.name}</h5>
								</div>
								{doctor.clinic.address && (
									<address>
										<p>{doctor.clinic.address.address_line1}</p>
										<p>
											{doctor.clinic.address.locality},{" "}
											{doctor.clinic.address.city}
										</p>
									</address>
								)}
							</div>
						)}

						<div className="consultation-types">
							{doctor.video_consult && (
								<span className="consultation-badge video">Video Consult</span>
							)}
							{doctor.in_clinic && (
								<span className="consultation-badge clinic">In Clinic</span>
							)}
						</div>
					</div>
				))
			)}
		</div>
	)
}

export default DoctorList
