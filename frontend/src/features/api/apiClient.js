// apiClient.js
class apiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Clear authentication token
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Generic request method with security headers
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Default headers for security
        const headers = {
            'Content-Type': 'application/json',
            // Prevent MIME type sniffing
            // 'X-Content-Type-Options': 'nosniff',
        };

        // Add authentication token if available
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                },
                // Include credentials for cookies
                credentials: 'include'
            });

            // Handle different response types
            if (!response.ok) {
                if (response.status === 401) {
                    this.clearToken();
                    throw new Error('Unauthorized access');
                }
                if (response.status === 403) {
                    throw new Error('Forbidden access');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Convenience methods for different HTTP methods
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

// Example usage
const api = new apiClient('http://i12a202.p.ssafy.io:8080/api/v1');
export { api };