
export default function Questions() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        phoneNumber: "",
        dob: "",
    });

    const register = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Register failed");
            }

            router.push("/sidebar/Questions"); // Redirect to Home
        } catch (error) {
            alert(error.message || "Login failed. Try again.");
        }
    };

    return (
        <div>
            <div className="flex h-screen w-full bg-[#0b0b0e]">
                {/* Main Content */}
                <div className="hidden md:flex flex-col justify-center px-12 text-center bg-black w-1/2">
                    <h1 className="text-gradient text-[60px] font-bold">EarthBeats</h1>
                    <p className="text-gradient text-[25px] mt-4">
                        Your ultimate eco-friendly road trip companion! Plan sustainable
                        journeys, discover green destinations, and track your environmental
                        impact—all while enjoying personalized music recommendations for the
                        road. Stay connected with friends, compete in eco-challenges, and get
                        AI-driven insights to make every trip more sustainable and fun!
                    </p>
                </div>
            </div>
            {/* Sidebar */}
            <div className="flex items-center justify-center w-full md:w-1/2 p-6">
                <div className="flex flex-col items-center p-6 rounded-lg shadow-lg w-full max-w-sm">
                    <h1 className="text-3xl font-bold text-gradient mb-4">Welcome!</h1>

                    <form className="w-full" onSubmit={register}>
                        <div className="mb-4">
                            <label className="block font-semibold text-white">First Name</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={credentials.firstName}
                                onChange={(e) => setCredentials({ ...credentials, firstName: e.target.value })}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

