import { Link, useLocation } from "react-router-dom";

function Home() {
	const location = useLocation();
	const onForm = location.pathname === "/form";
	return (
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center", width: "100vw" }}>
				<h1 style={{ marginBottom: "32px" }}>{onForm ? "Registration Form" : "Welcome to the Event Registration!"}</h1>
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
