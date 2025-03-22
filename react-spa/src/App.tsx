import React, { useState } from 'react';

interface GitHubUserResponse {
    isValid: boolean;
    user: {
        login: string;
        id: number;
        name: string;
        company: string;
        public_repos: number;
    }
}

const App: React.FC = () => {
    const [data, setData] = useState<GitHubUserResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>('');

    const fetchData = () => {

        if (!inputValue.trim()) {
            setError('Please enter a GitHub username');
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`${import.meta.env.VITE_API_URL}/GitHubUser/validate/${inputValue}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData: GitHubUserResponse) => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching data: ' + error.message);
                setLoading(false);
            });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Validate GitHub user:</h1>

            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="border p-2 rounded flex-grow"
                    placeholder="Enter GitHub username"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            </form>

            {loading && <div className="p-4">Loading...</div>}
            {error && <div className="p-4 text-red-500">{error}</div>}

            {!loading && !error && data && (
                <ul className="space-y-2">
                    {data.isValid ? (
                        <>
                            <li>Username: {data.user.login}</li>
                            <li>ID: {data.user.id}</li>
                            <li>Name: {data.user.name}</li>
                            <li>Company: {data.user.company}</li>
                            <li>Public repos: {data.user.public_repos}</li>
                        </>
                    ) : (
                        <li>User does not exist</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default App;