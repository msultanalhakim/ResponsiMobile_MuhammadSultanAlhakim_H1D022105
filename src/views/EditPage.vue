<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/home"></ion-back-button>
          </ion-buttons>
          <ion-title>Edit Explorer Information</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="form-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Edit Explorer Information</ion-card-title>
            </ion-card-header>
  
            <ion-card-content>
              <form @submit.prevent="submitForm">
                <!-- Explorer Name Field -->
                <ion-item class="input-item">
                  <ion-label position="stacked">Explorer Name</ion-label>
                  <ion-input
                    type="text"
                    v-model="form.explorer_name"
                    placeholder="Enter explorer name"
                    required
                  ></ion-input>
                </ion-item>
  
                <!-- Story Field (Journeys) -->
                <ion-item class="input-item">
                  <ion-label position="stacked">Story (Journeys)</ion-label>
                  <ion-input
                    type="text"
                    v-model="form.story"
                    placeholder="Enter story details"
                    required
                  ></ion-input>
                </ion-item>
  
                <!-- Submit Button -->
                <ion-button
                  expand="block"
                  type="submit"
                  color="primary"
                  :disabled="isSubmitting"
                  class="submit-button"
                >
                  <ion-spinner slot="start" v-if="isSubmitting"></ion-spinner>
                  Save Changes
                </ion-button>
  
                <!-- Reset Button -->
                <ion-button
                  expand="block"
                  type="button"
                  color="medium"
                  @click="resetForm"
                  class="reset-button"
                >
                  Reset
                </ion-button>
              </form>
            </ion-card-content>
          </ion-card>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { dataBase } from '@/firebase';
  import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
  
  // The form data model
  const form = ref({
    explorer_name: '',  // Explorer name
    story: '',       // Story or journey details
  });
  
  const router = useRoute();
  const isSubmitting = ref(false);
  
  // Get the itemId from the route parameters
  const route = useRoute();
  const itemId = route.params.itemId;
  
  console.log('Item ID:', itemId); // Log the item ID to confirm it's being passed
  
  // Fetch the item data when the component is mounted
  onMounted(async () => {
    if (itemId) {
      await fetchItemData(itemId);
    } else {
      console.error('No itemId found in route params.');
    }
  });
  
  // Function to fetch item data from Firestore
  const fetchItemData = async (itemId) => {
    try {
      // Reference to the item document in Firestore
      const itemDocRef = doc(dataBase, "journeys", itemId);  // Accessing 'journeys' collection
      const itemDocSnap = await getDoc(itemDocRef);
  
      if (itemDocSnap.exists()) {
        // Populate the form with the fetched data
        const itemData = itemDocSnap.data();
        console.log('Fetched item data:', itemData); // Log to ensure correct data
        form.value = {
          explorer_name: itemData.explorer_name || '', // Set explorer name
          story: itemData.story || '',           // Set story details
        };
      } else {
        console.error("No such item found!");
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
    }
  };
  
  // Function to submit the form and update item data in Firestore
  const submitForm = async () => {
    isSubmitting.value = true;
    try {
      // Reference to the item document in Firestore
      const itemDocRef = doc(dataBase, "journeys", itemId);  // Accessing 'journeys' collection
  
      // Update the item data in Firestore
      await updateDoc(itemDocRef, {
        explorer_name: form.value.explorer_name, // Store explorer name
        story: form.value.story,           // Store journey details
      });
  
      alert('Explorer information updated successfully!');
    } catch (error) {
      console.error('Error updating item data:', error);
      alert('Failed to update item. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Function to reset the form
  const resetForm = () => {
    form.value = {
      explorer_name: '',  // Reset explorer name
      journeys: '',       // Reset journeys
    };
  };
  </script>
  
  <style scoped>
  ion-content {
    --background: #f7f9fc;
  }
  
  .form-container {
    padding: 20px;
  }
  
  ion-card {
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
  }
  
  ion-card-title {
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    color: #333;
  }
  
  .input-item {
    margin-top: 15px;
    --highlight-color-focused: #4caf50;
    --placeholder-color: #aaa;
    --placeholder-font-style: italic;
  }
  
  .submit-button {
    margin-top: 20px;
    --background: #4caf50;
    --background-hover: #45a049;
    --box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
    font-weight: bold;
  }
  
  .reset-button {
    margin-top: 10px;
    --background: #e0e0e0;
    --background-hover: #d6d6d6;
    --color: #555;
  }
  </style>
  