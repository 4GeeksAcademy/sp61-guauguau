const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
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
