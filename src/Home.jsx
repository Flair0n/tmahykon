
import { Link, useLocation } from "react-router-dom";
import tmaLogo from "./assets/16-removebg-preview.png";

function Home() {
	const location = useLocation();
	const onForm = location.pathname === "/form";
	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center", width: "100vw" }}>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', gap: '18px' }}>
				<h1 style={{ margin: 0, fontSize: 36, fontWeight: 700, letterSpacing: 1 }}>
					TMA-Hykon Challenge
				</h1>
				<img src={tmaLogo} alt="TMA-Hykon Logo" style={{ height: 60, width: 'auto', verticalAlign: 'middle' }} />
			</div>
			{onForm ? (
				<Link to="/">
					<button style={{ padding: "10px 24px", fontSize: "18px", margin: "16px auto" }}>Back to Home</button>
				</Link>
			) : (
				<Link to="/form">
					<button style={{ padding: "10px 24px", fontSize: "18px", margin: "16px auto" }}>Go to Registration Form</button>
				</Link>
			)}
		</div>
	);
}

export default Home;
