const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			email: null,
			owners: [],
			pets: [],
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
			]
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
			fetchPets: () => {
				console.log(process.env.BACKEND_URL + "/api/pets")
				fetch(process.env.BACKEND_URL + "/api/pets")
					.then(response => {
						if (!response.ok) {
							throw new Error("Network response was not ok " + response.statusText);
						}
						return response.json();
					})
					.then(data => setStore({ pets: data }))
					.catch(error => console.error("Error fetching pets:", error));
			},
			fetchDeletePet: (id) => {
				fetch(process.env.BACKEND_URL + `/api/delete_pet/${id}`, {
					
					method: 'DELETE',
					headers: {
						"Content-type": "application/json",
						'Access-Control-Allow-Origin': '*',
					},
				})
				.then(response => {
					if (!response.ok) {
						throw new Error("Network response was not ok " + response.statusText);
					}
					return response.json();
				})
				.then(data => {
					console.log("Pet deleted successfully:", data);
					
					getActions().fetchPets(); 
				})
				.catch(error => console.error("Error deleting pet:", error));
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
			}
		}
	};
};

export default getState;
