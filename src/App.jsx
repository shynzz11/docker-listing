import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DoctorListing from "./components/DoctorListing"

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<DoctorListing />} />
			</Routes>
		</Router>
	)
}

export default App
