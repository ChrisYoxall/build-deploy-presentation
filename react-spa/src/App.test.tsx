import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
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


    it('Shows loading state initially', () => {
        // Mock fetch to return a promise that never resolves for this test
        vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

        render(<App />);
        // Use correct type for getByText
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('Renders posts when API call succeeds', async () => {
        // Mock successful API response
        const mockPosts = [
            { id: 1, title: 'Test Title 1', body: 'Test Body 1' },
            { id: 2, title: 'Test Title 2', body: 'Test Body 2' }
        ];

        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockPosts
        } as unknown as Response);

        render(<App />);

        // Wait for posts to be displayed
        await waitFor(() => {
            expect(screen.getByText('Test Title 1')).toBeInTheDocument();
            expect(screen.getByText('Test Body 2')).toBeInTheDocument();
        });
    });

    it('Shows error when API call fails', async () => {
        // Mock failed API response
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: false,
            status: 404
        } as unknown as Response);

        render(<App />);

        // Wait for error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Error fetching data: Network response was not ok')).toBeInTheDocument();
        });
    });
});