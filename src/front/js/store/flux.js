import axios from 'axios';

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			auth: false,
			email: null,
			owners: [],
			owner: null,
			selectedPetId: null, // Añadido para la mascota seleccionada
			profilePictureUrl: null,
			ownerDescription: null, // NUEVO CRIS
			city: [],
			pets: [],
			currentPet: null,
			currentPetId: null,
			message: null,
			breed: [],
			externalBreeds: [], // Nueva propiedad para almacenar las razas de la API externa
			currentBreed: null,
			admins: [],
			adminAuth: false,
			adminEmail: null,
			adminErrorMessage: null,
			photo: [],
			token: null,
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
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},
			changeColor: (index, color) => {
				const store = getStore();
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				setStore({ demo: demo });
			},
			adminLogin: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/adminlogin", {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ email, password })
					});
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message);
					}
					const data = await response.json();
					localStorage.setItem("admin_token", data.access_token);
					setStore({ adminAuth: true, adminEmail: email });
				} catch (error) {
					setStore({ adminAuth: false, adminErrorMessage: error.message });
					throw error;
				}
			},
			adminLogout: () => {
				localStorage.removeItem("admin_token");
				setStore({ adminAuth: false, adminEmail: null });
			},
			login: async (email, password) => {
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password })
				};
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/login`, requestOptions);
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`Error: ${errorText}`);
					}
					
					const data = await response.json();
					localStorage.setItem("token", data.access_token);
					setStore({ auth: true, email });
			
					// Obtener datos del propietario autenticado
					const ownerResponse = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${data.access_token}`
						}
					});
			
					if (!ownerResponse.ok) {
						const errorText = await ownerResponse.text();
						console.error("Error fetching owner data:", errorText);
						throw new Error(`Error fetching owner data: ${errorText}`);
					}
			
					const ownerData = await ownerResponse.json();
					console.log("Owner data:", ownerData);  // Log para depuración
					setStore({
						profilePictureUrl: ownerData.owner.profile_picture_url,
						email: ownerData.owner.email,
						owner: ownerData.owner,
						ownerDescription: ownerData.owner.description,
						currentPetId: ownerData.owner.pets.length > 0 ? ownerData.owner.pets[0].id : null  // Solo establece currentPetId si hay mascotas
					});
				} catch (error) {
					console.error("Login error:", error);
					setStore({ auth: false, email: null });
					throw error;
				}
			},
			
            verifyToken: async () => {
				try {
					const token = localStorage.getItem("token");
					if (!token) {
						setStore({ auth: false });
						return;
					}
			
					const response = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
			
					if (!response.ok) {
						const errorText = await response.text();
						console.error("Error verifying token:", errorText);
						setStore({ auth: false });
						localStorage.removeItem("token");
						return;
					}
			
					const data = await response.json();
					setStore({
						auth: true,
						token,
						profilePictureUrl: data.owner.profile_picture_url,
						email: data.owner.email,
						owner: data.owner,
						ownerDescription: data.owner.description,
						city: data.owner.city,
						currentPetId: data.owner.pets.length > 0 ? data.owner.pets[0].id : null
					});
			
					getActions().fetchOwnerPets();
				} catch (error) {
					console.error("Error verifying token:", error);
					setStore({ auth: false });
					localStorage.removeItem("token");
				}
			},			
			
			selectPet: (petId) => {
				setStore({ selectedPetId: petId });
			},
			logout: () => {
				localStorage.removeItem("token");
				setStore({ auth: false, email: null, profilePictureUrl: null, token: null });
			},
			fetchMessages: async (matchId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/messages/${matchId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error("Error fetching messages");
                    }

                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    throw error;
                }
            },
			sendMessage: async (matchId, senderPetId, content) => {
				if (!matchId || !senderPetId || !content) {
					console.error("Missing data:", { matchId, senderPetId, content });
					throw new Error("Missing data");
				}
			
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/message`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${localStorage.getItem("token")}`
						},
						body: JSON.stringify({
							match_id: matchId,
							sender_pet_id: senderPetId,
							content: content
						})
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Error sending message");
					}
			
					const data = await response.json();
					return data;
				} catch (error) {
					console.error("Error sending message:", error);
					throw error;
				}
			},
			signUp: async (name, email, password, address, latitude, longitude) => {
				try {
					const requestOptions = {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ name, email, password, address, latitude, longitude })
					};
					const response = await fetch(process.env.BACKEND_URL + '/api/add_owner', requestOptions);
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || 'An error occurred');
					}
					const data = await response.json();
					setStore({ auth: true, email: email });
					localStorage.setItem('token', data.access_token);
					return data;
				} catch (error) {
					console.error('Error signing up:', error);
					throw error;
				}
			},
			
				
			fetchOwners: () => {
				fetch(process.env.BACKEND_URL + "/api/owner")
					.then(response => response.json())
					.then(data => setStore({ owners: data }))
					.catch(error => console.error("Error fetching owners:", error));
			},
			getOwnerDetails: async (ownerId) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/owner/${ownerId}`);
					if (!response.ok) {
						throw new Error('Error fetching owner details');
					}
					const owner = await response.json();
					owner.pets = owner.pets || [];
					return owner;
				} catch (error) {
					console.error('Error fetching owner details:', error);
				}
			},
			updateOwnerDescription: async (description) => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${process.env.BACKEND_URL}/api/update_owner_description`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({ description })
					});

					if (!response.ok) {
						throw new Error('Error updating description');
					}

					const data = await response.json();
					setStore({ ownerDescription: data.description });
				} catch (error) {
					console.error('Error updating description:', error);
				}
			},
			fetchPets: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/pets`);
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`Network response was not ok: ${errorText}`);
					}
					const data = await response.json();
					console.log("Pets data fetched:", data);
					setStore({ pets: data });
				} catch (error) {
					console.error("Error fetching pets:", error);
				}
			},
			
			fetchPetById: async (id) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/pets/${id}`);
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
					}
					const data = await response.json();
					setStore({ currentPet: data });
					console.log(`Fetching pet with ID: ${id}`);
				} catch (error) {
					console.error("Error fetching pet by ID:", error);
				}
			},
			
			getPetDetails: async (petId) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/pet/${petId}`);
					if (!response.ok) {
						throw new Error('Error fetching pet details');
					}
					const pet = await response.json();
					pet.photos = pet.photos || [];  // Asegúrate de que photos no sea null
					pet.description = pet.description || '';  // Asegúrate de que description no sea null
					setStore({ currentPet: pet });
					return pet;
				} catch (error) {
					console.error('Error fetching pet details:', error);
				}
			},
			updatePet: async (petId, petDetails) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/pet/${petId}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(petDetails)
					});
					if (!response.ok) {
						throw new Error('Error updating pet');
					}
					const data = await response.json();
					const store = getStore();
					const updatedPets = store.pets.map(pet => pet.id === petId ? data : pet);
					setStore({ pets: updatedPets, currentPet: data });
					return data;
				} catch (error) {
					console.error('Error updating pet:', error);
				}
			},
			addPet: async (pet) => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${process.env.BACKEND_URL}/api/pets`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						},
						body: JSON.stringify(pet)
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						console.error("Failed to add pet:", errorData);
						throw new Error(errorData.message);
					}
			
					const newPet = await response.json();
					const store = getStore();
					setStore({ pets: [...store.pets, newPet] });
					return newPet;
				} catch (error) {
					console.error("Error adding pet:", error);
					throw error;
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
						getActions().fetchOwnerPets();
					})
					.catch(error => console.error("Error deleting pet:", error));
			},
			fetchExternalBreeds: async () => {
                try {
                    const response = await axios.get('https://api.thedogapi.com/v1/breeds', {
                        headers: {
                            'x-api-key': 'your-api-key'
                        }
                    });
                    setStore({ externalBreeds: response.data });
                } catch (error) {
                    console.error("Error fetching breeds from external API:", error);
                }
            },
			fetchBreeds: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/breed");
					const breeds = await response.json();
					setStore({ breeds: breeds });
				} catch (error) {
					console.error("Error fetching breeds:", error);
				}
			},
			populateBreeds: async () => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/populate_breeds", {
						method: 'POST'
					});
					if (response.ok) {
						console.log("Breeds populated successfully");
						getActions().fetchBreeds();
					} else {
						console.error("Failed to populate breeds");
					}
				} catch (error) {
					console.error("Error populating breeds:", error);
				}
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
			fetchOwnerPets: async () => {
				try {
					const token = localStorage.getItem("token");
					if (!token) throw new Error("No token found");
			
					const response = await fetch(`${process.env.BACKEND_URL}/api/owner_pets`, {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});
			
					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
					}
			
					const pets = await response.json();
					setStore({ ownerPets: pets });
				} catch (error) {
					console.error("Error fetching owner's pets:", error);
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
			getBreed: () => {
				fetch(process.env.BACKEND_URL + "/api/breed")
					.then(response => response.json())
					.then(data => setStore({ breed: data }))
					.catch(error => console.error("Error fetching breed:", error));
			},
			signUpBreed: (name, type, life_span) => {
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': "application/json" },
					body: JSON.stringify({ name, type, life_span })
				};
				fetch(process.env.BACKEND_URL + "/api/breed", requestOptions)
					.then(response => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error("Breed already exists");
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
					.then(() => {
						const store = getStore();
						setStore({ breed: store.breed.filter(b => b.id !== breedId) });
					})
					.catch(error => console.error("Error deleting breed:", error));
			},
			editBreed: async (breedId, updatedBreed) => {
				try {
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
				} catch (error) {
					console.error("Error editing breed:", error);
				}
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
			},
			uploadProfilePicture: async (file) => {
				const formData = new FormData();
				formData.append('file', file);

				const token = localStorage.getItem("token");
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/upload_profile_picture', {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${token}`
						},
						body: formData
					});

					if (response.ok) {
						const data = await response.json();
						setStore({ profilePictureUrl: data.profile_picture_url });
					} else {
						throw new Error("Failed to upload image");
					}
				} catch (error) {
					console.error("Error uploading profile picture:", error);
				}
			},
			uploadPetPhoto: async (petId, file) => {
				const formData = new FormData();
				formData.append('file', file);

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/upload_pet_profile_picture/${petId}`, {
						method: 'POST',
						body: formData
					});

					if (!response.ok) throw new Error("HTTP error! status: " + response.status);
					const result = await response.json();
					return result; // Asegúrate de que el resultado contiene `photo_url`
				} catch (error) {
					console.error("Error uploading pet photo:", error);
				}
			},
			uploadPetAdditionalPhotos: async (petId, files) => {
				const formData = new FormData();
				for (const file of files) {
					formData.append("file", file);
				}
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/upload_pet_additional_photos/${petId}`, {
						method: 'POST',
						body: formData
					});
					if (!response.ok) throw new Error("Failed to upload additional photos");
					const result = await response.json();
					return result;
				} catch (error) {
					console.error("Error uploading additional photos:", error);
					throw error;
				}
			},
			updatePhotoOrder: async (photoOrders) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/update_photo_order`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(photoOrders)
					});
					if (!response.ok) {
						throw new Error('Error updating photo order');
					}
					const data = await response.json();
					console.log('Photo order updated successfully:', data);
					const store = getStore();
					const updatedPhotos = store.currentPet.photos.map(photo => {
						const updatedPhoto = photoOrders.find(p => p.id === photo.id);
						return updatedPhoto ? { ...photo, order: updatedPhoto.order } : photo;
					}).sort((a, b) => a.order - b.order);
					setStore({ currentPet: { ...store.currentPet, photos: updatedPhotos } });
				} catch (error) {
					console.error('Error updating photo order:', error);
				}
			},
			getPhoto: () => {
				fetch(process.env.BACKEND_URL + "/api/photo")
					.then(response => response.json())
					.then(data => setStore({ photo: data }))
					.catch(error => console.error("Error fetching photo:", error));
			},
			uploadPhoto: async (file) => {
				const formData = new FormData();
				formData.append('file', file);

				try {
					const response = await fetch('URL_DEL_ENDPOINT', {
						method: 'POST',
						body: formData
					});

					if (response.ok) {
						const newPhoto = await response.json();
						const store = getStore();
						setStore({ photo: [...store.photo, newPhoto] });
					} else {
						console.error('Error al subir el archivo');
					}
				} catch (error) {
					console.error('Error:', error);
				}
			},
			deletePhoto: async (photoId) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/photo/${photoId}`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json'
						}
					});
					if (!response.ok) throw new Error('Failed to delete photo');

					const store = getStore();
					const updatedPhotos = store.currentPet.photos.filter(photo => photo.id !== photoId);
					setStore({ currentPet: { ...store.currentPet, photos: updatedPhotos } });
				} catch (error) {
					console.error('Error deleting photo:', error);
				}
			},
			fetchPetLikes: async (petId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/pet/${petId}/likes`);
                    if (!response.ok) {
                        throw new Error('Error fetching pet likes');
                    }
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error fetching pet likes:', error);
                    throw error;
                }
            },
            fetchPetMatches: async (petId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/pet/${petId}/matches`);
                    if (!response.ok) {
                        throw new Error('Error fetching pet matches');
                    }
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error fetching pet matches:', error);
                    throw error;
                }
            },
			fetchCuidados: async (raza) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/cuidados/${raza}`);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					return data.text; // Devuelve el texto de los cuidados
				} catch (error) {
					console.error("Error fetching cuidados:", error);
					throw error;
				}
			},
			fetchCompatibilidad: async (raza) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/compatibilidad/${raza}`);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const data = await response.json();
					return data.text; // Devuelve el texto de la compatibilidad
				} catch (error) {
					console.error("Error fetching compatibilidad:", error);
					throw error;
				}
			},
			likePet: async (likerPetId, likedPetId) => {
				try {
					const token = localStorage.getItem("token");
					const response = await fetch(`${process.env.BACKEND_URL}/api/like_pet`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({ liker_pet_id: likerPetId, liked_pet_id: likedPetId })
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || 'Error liking the pet');
					}
			
					const data = await response.json();
					return data;
				} catch (error) {
					console.error('Error liking the pet:', error);
					throw error;
				}
			},
			BreedApi: () => {
			
				const getDogBreeds = async () => {
					const options = {
						method: 'GET',
						url: 'https://api.thedogapi.com/v1/breeds',
						headers: {
							'x-api-key': 'live_VTqPRCE1vpTptJOvyVn0xaz737ys72O39rFV61XYKXxwzjlA6yDJfsdlMRKl79Ax'
						}
					};
				
					try {
						const response = await axios(options);
						console.log(response.data);
						setStore({ raza: response.data });
					} catch (error) {
						console.error(error);
					}
				};
				
				// Llama a la función para obtener las razas
				getDogBreeds();
				console.log('se cargo desde flux');
				
							},

		}
	}

          
           

};

export default getState;
