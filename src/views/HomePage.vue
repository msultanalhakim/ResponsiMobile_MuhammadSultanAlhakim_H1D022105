<template>
  <ion-page>
    <ion-content fullscreen>
      <!-- Hero Section -->
      <div class="header-container">
        <div class="hero-section">
          <div class="profile-details">
            <img
              src="/assets/images/login-illustration.png"
              alt="Profile Picture"
              class="profile-picture"
            />
            <div class="profile-text">
              <p class="greeting">Welcome back,</p>
              <h2 class="user-name">User!</h2>
            </div>
          </div>
          <ion-button fill="clear" class="logout-button" @click="logout">
            <ion-icon :icon="logOutOutline"></ion-icon>
            Logout
          </ion-button>

        </div>
      </div>

      <!-- Data Section with Pagination -->
      <div class="data-section">
        <div class="data-header">
          <h2>Your Data</h2>
          <ion-button class="add-button" @click="navigateToAddData">
            <ion-icon :icon="addOutline"></ion-icon> Add Data
          </ion-button>
        </div>

        <!-- Handle loading, error, and data display -->
        <div v-if="loading">Loading...</div>
        <div v-if="error" class="error-message">{{ error }}</div>

        <div v-if="!loading && !error" class="data-items">
          <div class="data-item" v-for="item in paginatedJourneys" :key="item.id">
            <div class="item-info">
              <h3 style="color: black;">{{ item.explorer_name }}</h3>
              <p style="color: black;">{{ item.story }}</p>
            </div>
            <div class="item-actions">
              <ion-button fill="clear" class="edit-button" @click="handleEdit(item)">
                <ion-icon :icon="settingsOutline"></ion-icon> Edit
              </ion-button>
              <ion-button fill="clear" class="delete-button" @click="handleDelete(item)">
                <ion-icon :icon="trashOutline"></ion-icon> Delete
              </ion-button>
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination">
          <ion-button :disabled="currentPage === 1" @click="currentPage--">
            Previous
          </ion-button>
          <span>Page {{ currentPage }}</span>
          <ion-button :disabled="paginatedJourneys.length < pageSize" @click="currentPage++">
            Next
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { dataBase, auth } from '@/firebase';
import { useAuthStore } from '@/stores/auth'; 
import { settingsOutline, addOutline, trashOutline, logOutOutline } from 'ionicons/icons';
import firestoreService from "@/services/firestoreService"; // Adjust this path based on your file structure

const router = useRouter();
const journeys = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = 4;
const userName = ref('');

const authStore = useAuthStore();

const fetchUserDetails = async () => {
  if (authStore.isLoggedIn) {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(dataBase, 'users', user.uid));
        if (userDoc.exists()) {
          userName.value = userDoc.data().name || 'No name available';
        }
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  }
};

const fetchJourneys = async () => {
  loading.value = true;
  error.value = null;

  try {
    const querySnapshot = await getDocs(collection(dataBase, 'journeys'));
    if (querySnapshot.empty) {
      error.value = "No journeys found";
      return;
    }
    journeys.value = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = "Failed to fetch data. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const paginatedJourneys = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return journeys.value.slice(start, end);
});

onMounted(() => {
  fetchJourneys();
  fetchUserDetails();
});

// Navigate to Add Data page
const navigateToAddData = () => {
  router.push('/insert');
};

const handleEdit = (editItem: any) => {
  router.push({ name: 'Edit', params: { itemId: editItem.id } }); // Use itemId here
};

// Delete journey item
const handleDelete = async (deleteItem: any) => {
  try {
    await deleteDoc(doc(dataBase, 'journeys', deleteItem.id));
    alert('Item deleted successfully!');
    fetchJourneys(); // Refresh the list after deletion
  } catch (err) {
    console.error('Error deleting item:', err);
    alert('Failed to delete item.');
  }
};

// Fungsi logout
const logout = () => {
  // Panggil metode logout dari store
  authStore.logout();

  // Navigasi kembali ke halaman login
  router.push('/login'); // Ganti '/login' dengan rute login aplikasi Anda
};
</script>

<style scoped>
ion-content {
  --background: #f9faff;
  color: #fff;
  padding: 0;
}

.header-container {
  background: linear-gradient(135deg, #85a98f, #5a6c57);
  padding: 34px 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-details {
  display: flex;
  align-items: center;
  gap: 15px;
}

.profile-picture {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-text .greeting {
  margin: 0;
  font-size: 16px;
  color: #f5f5f5;
}

.profile-text .user-name {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}

.settings-button {
  --ion-color-primary: #fff;
  font-size: 20px;
}

.data-section {
  padding: 20px;
  margin-top: 10px;
}

.data-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-button {
  background-color: #3b7b57;
  color: white;
}

.error-message {
  color: red;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 10px;
}
</style>
