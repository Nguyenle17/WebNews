const BASE_URL = 'http://localhost:8081/api'
class Api {
    constructor(BASE_URL) {
        this.token = localStorage.getItem("access_token") || "";
        this.BASE_URL = BASE_URL;
    }

    async get(ENDPOINT) {
        const NEW_URL = this.BASE_URL + ENDPOINT;
        try {
            const response = await fetch(NEW_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            });
            const result = await response.json();

            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async post(ENDPOINT, DATA) {
        const NEW_URL = this.BASE_URL + ENDPOINT;
        try {
            const isFormData = DATA instanceof FormData;

            const response = await fetch(NEW_URL, {
                method: 'POST',
                headers: {
                    ...(isFormData ? {
                        'Authorization': `Bearer ${this.token}`,
                    } : {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }),
                },
                body: isFormData ? DATA : JSON.stringify(DATA),
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error during POST request:', error.message);
            throw error;
        }
    }

    async put(ENDPOINT, DATA) {
        const NEW_URL = this.BASE_URL + ENDPOINT;
        try {
            const isFormData = DATA instanceof FormData;

            const response = await fetch(NEW_URL, {
                method: "PUT",
                headers: {
                    ...(isFormData ? {
                        'Authorization': `Bearer ${this.token}`,
                    } : {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }),
                },
                body: isFormData ? DATA : JSON.stringify(DATA),
            })

            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error)
        }
    }

    async delete(ENDPOINT) {
        const NEW_URL = this.BASE_URL + ENDPOINT;
        try {
            const response = await fetch(NEW_URL, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                }
            });
            const result = await response.json();

            return result;
        } catch (error) {
            console.log(error);
        }
    }
}

export default new Api(BASE_URL);