import { Routes, Route, Link } from "react-router-dom";
import Side from "./components/Side";
import Main from "./components/Main";
import ChatRoom from "./pages/ChatRoom";


function App() {

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<ChatRoom />} />
			</Routes>
		</div>
	);
}

export default App;
