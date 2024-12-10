<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/home"></ion-back-button>
          </ion-buttons>
          <ion-title>Add Explorer</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="form-container">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Create New Explorer</ion-card-title>
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
  
                <!-- Story Field -->
                <ion-item class="input-item">
                  <ion-label position="stacked">Story</ion-label>
                  <ion-textarea
                    v-model="form.story"
                    placeholder="Enter story"
                    required
                  ></ion-textarea>
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
                  Submit
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
  import { ref } from 'vue';
  import { getFirestore, collection, addDoc } from 'firebase/firestore';
  import { useRouter } from 'vue-router';
  
  // Inisialisasi Firestore
  const db = getFirestore();
  const router = useRouter();
  
  const form = ref({
    explorer_name: '',
    story: '',
  });
  
  const isSubmitting = ref(false);
  
  const submitForm = async () => {
    isSubmitting.value = true;
    try {
      // Menambahkan data ke Firestore
      const docRef = await addDoc(collection(db, 'journeys'), {
        explorer_name: form.value.explorer_name,
        story: form.value.story,
        createdAt: new Date(),
      });
  
      alert('Explorer successfully added!');
      resetForm();
      router.push('/home'); // Redirect ke halaman utama setelah berhasil menambah data
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to add explorer. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  };
  
  const resetForm = () => {
    form.value = {
      explorer_name: '',
      story: '',
    };
  };
  </script>
  
  <style scoped>
  ion-content {
    --background: #f2f5f9;
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
  