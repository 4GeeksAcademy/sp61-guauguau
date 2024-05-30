const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			auth: false,
			email: null,
			owners: [],
			city:[],
			pets: [],
			currentPet: null,
			message: null,
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
			login: (email, password) => {
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password })
				};
				return fetch(process.env.BACKEND_URL + "/api/login", requestOptions)
					.then(response => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error("Email or password wrong");
						}
					})
					.then(data => {
						localStorage.setItem("token", data.access_token);
						setStore({ auth: true, email });
					})
					.catch(error => {
						setStore({ auth: false, email: null });
						throw error;
					});
			},

			verifyToken: async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (token) {
                        setStore({ auth: true });
                    } else {
                        setStore({ auth: false });
                    }
                } catch (error) {
                    console.error("Error al verificar el token:", error);
                }
            },

			logout: () => {
				console.log("log out desde flux")
				localStorage.removeItem("token");
				setStore({auth: false})
			},

			signUp: async (name, email, password) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ name, email, password })
					};
					const response = await fetch(process.env.BACKEND_URL + '/api/add_owner', requestOptions);
					if (response.ok) {
						const data = await response.json();
						setStore({ auth: true, email: email });
						localStorage.setItem('token', data.access_token);
						return data; 
					} else if (response.status === 409) {  // el codigo 409 lo toma del endpoint add_owner donde lo he definido
						throw new Error('Email already exists!');
					} else {
						const errorData = await response.json();
						throw new Error(errorData.message || 'An error occurred');
					}
				} catch (error) {
					console.error('There was an error!', error);
					throw error; 
				}
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
			fetchPetById: async (id) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + `/api/pets/${id}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setStore({ currentPet: data });
					console.log(`Fetching pet with ID: ${id}`);
                } catch (error) {
                    console.error("Error fetching pet by ID:", error);
                }
            },
			updatePet: async (id, petDetails) => {
                try {
                    console.log(`Updating pet with ID: ${id}`);
                    const response = await fetch(process.env.BACKEND_URL + `/api/pets/${id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(petDetails)
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Updated pet data:", data);
                    setStore({ currentPet: data });
                } catch (error) {
                    console.error("Error updating pet by ID:", error);
                }
            },
			addPet: async (pet) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/pets", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(pet)
                    });
                    if (response.ok) {
                        getActions().fetchPets(); // Refresh the list
                    } else {
                        console.error("Failed to add pet");
                    }
                } catch (error) {
                    console.error("Error adding pet:", error);
                }
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
						
						const actions = getActions();
						
						actions.fetchOwners();
					})
					.catch(error => console.error("Error deleting owner:", error));
			},
			
			getCity: () => {
                fetch(process.env.BACKEND_URL + "/api/city")
                    .then(response => response.json())
                    .then(data => setStore({ city: data }))
                    .catch(error => console.error("Error fetching city:", error));
            },

            addCity: (newCity) => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCity)
                };
                fetch(process.env.BACKEND_URL + "/api/city", requestOptions)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Error adding city");
                        }
                    })
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
                    .catch(error => console.error("Error deleting city:", error));
			      updateOwner: async owner => {
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
	}
	}
};

export default getState