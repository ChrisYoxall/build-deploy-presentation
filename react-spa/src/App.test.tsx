import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
    // Setup mock before all tests
    beforeAll(() => {
        // Mock fetch globally
        global.fetch = vi.fn();
    });

    // Reset mocks after each test
    afterEach(() => {
        vi.resetAllMocks();
    });

    // Cleanup after all tests
    afterAll(() => {
        vi.restoreAllMocks();
    });

    it('Shows loading state initially', async () => {
        // Mock fetch to return a promise that never resolves for this test
        vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

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
            isValid: true,
            user: {
                login: 'login_123',
                id: 123,
                name: 'name',
                company: 'company_ABC',
                public_repos: 3
            }
        };

        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        } as unknown as Response);

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
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: false,
            status: 404
        } as unknown as Response);

        render(<App />);

        // Simulate user entering a username and clicking search
        const input = screen.getByPlaceholderText('Enter GitHub username');
        const button = screen.getByRole('button', { name: /submit/i });

        await userEvent.type(input, 'tester');
        await userEvent.click(button);

        // Wait for error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Error fetching data: Network response was not ok')).toBeInTheDocument();
        });
    });
});
