const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {

			message: null,
			email: null,
			owners: [],
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			breed:[],
			currentBreed:null,
			

			// Aquí van los estados iniciales

		},
		actions: {
			// Aquí van las acciones
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			getCity: () => {
				fetch(process.env.BACKEND_URL + "/api/city")
					.then(response => response.json())
					.then(data => setStore({ city: data }))
					.catch(error => console.error("Error loading cities:", error));
			},

			addCity: (newCity) => {
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newCity)
				};
				fetch(process.env.BACKEND_URL + "/api/city", requestOptions)
					.then(response => response.json())
					.then(data => {
						const store = getStore();
						setStore({ city: [...store.city, data] });
					})
					.catch(error => console.error("Error adding city:", error));
			},

			editCity: (updatedCity) => {
				const requestOptions = {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updatedCity)
				};
				fetch(process.env.BACKEND_URL + `/api/city/${updatedCity.id}`, requestOptions)
					.then(response => response.json())
					.then(data => {
						const store = getStore();
						setStore({
							city: store.city.map(city =>
								city.id === updatedCity.id ? updatedCity : city
							)
						});
					})
					.catch(error => console.error("Error editing city:", error));
			},

			deleteCity: (id) => {
				const requestOptions = {
					method: 'DELETE'
				};
				fetch(process.env.BACKEND_URL + `/api/city/${id}`, requestOptions)
					.then(response => response.json())
					.then(data => {
						const store = getStore();
						setStore({ city: store.city.filter(city => city.id !== id) });
					})

					.catch(error => console.error("Error deleting owner:", error));
			},
			

			getBreed:() =>{
				fetch(process.env.BACKEND_URL + "/api/breed")
				.then(response => response.json())
				.then(data => setStore({breed:data}))
				.catch(error => console.error("Error fetching breed:", error));


			},
			signUpBreed: (name, type ) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify({ name, type})
                };
                fetch(process.env.BACKEND_URL + "/api/breed", requestOptions)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("User already exists");
                        }
                    })
                    .then(data => {
                        setStore({ auth: true, name: name });
                    })
                    .catch(error => {
                        console.error("There was an error!", error);
                        setStore({ errorMessage: error.message });
                    });
            },
			deleteBreed: breedId => {
				const requestOptions = {
					method: 'DELETE'
				};
				fetch(process.env.BACKEND_URL + `/api/breed/${breedId}`, requestOptions)
					.then(response => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error("Failed to delete breed");
						}
					})
					
					.catch(error => console.error("Error deleting breed:", error));
			},
			editBreed: async (breedId, updatedBreed) => {
                const response = await fetch(process.env.BACKEND_URL + `/api/breed/${breedId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedBreed)
                });
                if (response.ok) {
                    const data = await response.json();
                    const updatedBreeds = getStore().breed.map(breed => breed.id === breedId ? data : breed);
                    setStore({ breed: updatedBreeds });
                } else {
                    console.error('Error al actualizar la raza');
                }
            },
	

					.catch(error => console.error("Error deleting city:", error));
			},

			updateOwner: async (owner) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + `/api/owner/${owner.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': "application/json" },
						body: JSON.stringify(owner)
					});
					if (!response.ok) throw new Error("Failed to update owner");
					const updatedOwner = await response.json();
					const updatedOwners = getStore().owners.map(o => o.id === owner.id ? updatedOwner : o);
					setStore({ owners: updatedOwners });
				} catch (error) {
					console.error("Error updating owner:", error);
				}
			}
		}
	};
};

export default getState;
