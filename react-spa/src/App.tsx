import React, { useState, useEffect } from 'react';

interface Post {
    id: number;
    title: string;
    body: string;
}

const App: React.FC = () => {
    const [data, setData] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>('posts');

    const fetchData = () => {
        setLoading(true);
        setError(null);

        fetch(`https://jsonplaceholder.typicode.com/${inputValue}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData: Post[]) => {
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

    // Initial fetch when component mounts
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Call user check endpoint with the below user:</h1>

            <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter endpoint (e.g., posts, users, comments)"
                    className="border p-2 rounded flex-grow"
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

            {!loading && !error && (
                <ul className="space-y-2">
                    {data.slice(0, 10).map(item => (
                        <li key={item.id} className="border p-3 rounded">
                            <h2 className="font-semibold">{item.title}</h2>
                            <p>{item.body}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;