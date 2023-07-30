// Function to store API key
export function storeApiKey(apiKey: string): void {
    localStorage.setItem('apiKey', apiKey);
}

// Function to read API key
export function readApiKey(): string | null {
    return localStorage.getItem('apiKey');
}