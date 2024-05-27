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
			
		},
		actions: {
			// Use getActions to call a function within a fuction
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
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			signUp: (name, email, password) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify({ name, email, password })
                };
                fetch(process.env.BACKEND_URL + "/api/add_owner", requestOptions)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("User already exists");
                        }
                    })
                    .then(data => {
                        setStore({ auth: true, email: email });
                        localStorage.setItem("token", data.access_token);
                    })
                    .catch(error => {
                        console.error("There was an error!", error);
                        setStore({ errorMessage: error.message });
                    });
            },
			fetchOwners: () => {
                fetch(process.env.BACKEND_URL + "/api/owner")
                    .then(response => response.json())
                    .then(data => setStore({ owners: data }))
                    .catch(error => console.error("Error fetching owners:", error));
            },
			deleteOwner: ownerId => {
				const requestOptions = {
					method: 'DELETE'
				};
				fetch(process.env.BACKEND_URL + `/api/owner/${ownerId}`, requestOptions)
					.then(response => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error("Failed to delete owner");
						}
					})
					.then(data => {
						// Obtener las acciones
						const actions = getActions();
						// Ejecutar la acción fetchOwners para actualizar la lista de propietarios después de eliminar uno
						actions.fetchOwners();
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
	
			
		}
	};
};

export default getState;
