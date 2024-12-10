<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="ion-padding register-page">
        <div class="form-container">
          <div class="header-image">
            <img src="/assets/images/register-illustration.png" alt="Register Illustration" />
          </div>
          <h1 class="title">Donasi Kita</h1>
          <p class="subtitle">Your journey to making a difference begins here!</p>

          <!-- Input Nama Lengkap -->
          <ion-item class="form-input">
            <ion-icon :icon="personOutline" slot="start" class="input-icon"></ion-icon>
            <ion-input
              v-model="fullName"
              placeholder="Full Name"
              type="text"
              class="input-item"
              required
            ></ion-input>
          </ion-item>

          <!-- Input Email -->
          <ion-item class="form-input">
            <ion-icon :icon="mailOutline" slot="start" class="input-icon"></ion-icon>
            <ion-input
              v-model="email"
              placeholder="Email Address"
              type="email"
              class="input-item"
              required
            ></ion-input>
          </ion-item>

          <!-- Input Password -->
          <ion-item class="form-input">
            <ion-icon :icon="lockClosedOutline" slot="start" class="input-icon"></ion-icon>
            <ion-input
              v-model="password"
              :type="passwordVisible ? 'text' : 'password'"
              placeholder="Password"
              class="input-item"
              required
            ></ion-input>
            <ion-icon
              :icon="passwordVisible ? eyeOutline : eyeOffOutline"
              slot="end"
              class="visibility-icon"
              @click="toggleVisibility('password')"
            ></ion-icon>
          </ion-item>

          <!-- Input Konfirmasi Password -->
          <ion-item class="form-input">
            <ion-icon :icon="lockClosedOutline" slot="start" class="input-icon"></ion-icon>
            <ion-input
              v-model="confirmPassword"
              :type="passwordConfirmVisible ? 'text' : 'password'"
              placeholder="Confirm Password"
              class="input-item"
              required
            ></ion-input>
            <ion-icon
              :icon="passwordConfirmVisible ? eyeOutline : eyeOffOutline"
              slot="end"
              class="visibility-icon"
              @click="toggleVisibility('confirmPassword')"
            ></ion-icon>
          </ion-item>

          <!-- Tombol Register -->
          <ion-button expand="block" class="submit-button" @click="register">
            Register
          </ion-button>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <p class="text-muted">
            Already have an account?
            <a href="/login" class="link">Login</a>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router"; // Import Vue Router untuk navigasi
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase"; // Sesuaikan path
import { getFirestore, collection, doc, setDoc } from "firebase/firestore"; // Firestore
const db = getFirestore(); // Inisialisasi Firestore

// Ikon
import {
  mailOutline,
  personOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
} from "ionicons/icons";

// State
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);
const errorMessage = ref("");

// Menggunakan Vue Router untuk navigasi
const router = useRouter();

// Fungsi toggle visibilitas password
function toggleVisibility(type: "password" | "confirmPassword") {
  if (type === "password") {
    passwordVisible.value = !passwordVisible.value;
  } else {
    passwordConfirmVisible.value = !passwordConfirmVisible.value;
  }
}

// Fungsi registrasi
async function register() {
  errorMessage.value = "";

  // Validasi input
  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = "Please fill in all the fields.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match!";
    return;
  }

  try {
    // Register user dengan Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    const user = userCredential.user;

    // Simpan data ke Firestore
    await setDoc(doc(collection(db, "users"), user.uid), {
      fullName: fullName.value,
      email: email.value,
      createdAt: new Date().toISOString(),
    });

    // Redirect ke halaman login setelah registrasi sukses
    router.push("/login");
  } catch (error: any) {
    errorMessage.value = error.message || "Registration failed!";
  }
}
</script>
<style scoped>
.register-page {
    background: #f9faff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.header-image {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.header-image img {
    width: 80%;
    max-width: 300px;
}

.form-container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.subtitle {
  font-size: 14px;
  color: #6c757d;
  margin-top: -6px;
  margin-bottom: 20px;
  text-align: center;
}

.form-input {
    position: relative;
    margin-bottom: 15px;
    border-radius: 8px;
    --background: #E9EFEC;
    color: #525B44;
  }
  
  .input-icon {
    color: #525B44;
    position: absolute;
    display: flex;
    align-items: center;
    height: 40%;
  }

.input-item {
    margin-left: 40px;
}

.visibility-icon {
  color: #6c757d;
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s ease;
}

.visibility-icon:hover {
  color: #85a98f;
}

.submit-button {
    margin-top: 24px;

  --background: #85A98F;
  --background-hover: #5A6C57;
  --background-activated: #525B44;
  --border-radius: 26px;
  transition: background-color 0.5s ease-in-out;
}

.text-muted {
  margin-top: 16px;
  font-size: 14px;
  color: #6c757d;
  text-align: center;
}

.link {
    color: #4caf50;
    text-decoration: none;
}

.error-message {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

</style>
  