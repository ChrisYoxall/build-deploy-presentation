import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, afterAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

// Mock axios module
vi.mock('axios');

describe('App Component', () => {

    // Reset mocks after each test
    afterEach(() => {
        vi.resetAllMocks();
    });

    // Cleanup after all tests
    afterAll(() => {
        vi.restoreAllMocks();
    });

    it('Shows loading state initially', async () => {
        // Mock axios to return a promise that never resolves for this test
        vi.mocked(axios.get).mockImplementation(() => new Promise(() => {}));

        render(<App />);

        // Simulate user entering a username and clicking search
        const input = screen.getByPlaceholderText('Enter GitHub username');
        const button = screen.getByRole('button', { name: /submit/i });

        await userEvent.type(input, 'tester');
        await userEvent.click(button);

        // Check that loading state is displayed
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('Renders user data when API call succeeds', async () => {
        // Mock successful API response
        const mockResponse = {
            data: {
                isValid: true,
                user: {
                    login: 'login_123',
                    id: 123,
                    name: 'name',
                    company: 'company_ABC',
                    public_repos: 3
                }
            }
        };

        vi.mocked(axios.get).mockResolvedValueOnce(mockResponse);

        render(<App />);

        // Simulate user entering a username and clicking submit
        const input = screen.getByPlaceholderText('Enter GitHub username');
        const button = screen.getByRole('button', { name: /submit/i });

        await userEvent.type(input, 'tester');
        await userEvent.click(button);

        // Wait for user data to be displayed
        await waitFor(() => {
            expect(screen.getByText(/login_123/i)).toBeInTheDocument();
            expect(screen.getByText(/company_ABC/i)).toBeInTheDocument();
        });
    });

    it('Shows error when API call fails', async () => {
        // Mock failed API response
        const mockError = new Error('Network Error');
        vi.mocked(axios.get).mockRejectedValueOnce(mockError);

        render(<App />);

        // Simulate user entering a username and clicking search
        const input = screen.getByPlaceholderText('Enter GitHub username');
        const button = screen.getByRole('button', { name: /submit/i });

        await userEvent.type(input, 'tester');
        await userEvent.click(button);

        // Wait for error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Error fetching data: Network Error')).toBeInTheDocument();
        });
    });

    it('Shows error with server message when API returns error response', async () => {
        // Mock server error response
        const mockError = {
            response: {
                status: 404,
                data: {
                    message: 'User not found'
                }
            }
        };
        vi.mocked(axios.get).mockRejectedValueOnce(mockError);

        render(<App />);

        // Simulate user entering a username and clicking search
        const input = screen.getByPlaceholderText('Enter GitHub username');
        const button = screen.getByRole('button', { name: /submit/i });

        await userEvent.type(input, 'tester');
        await userEvent.click(button);

        // Wait for error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Error fetching data: User not found')).toBeInTheDocument();
        });
    });
});
