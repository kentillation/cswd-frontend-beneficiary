<template>
  <v-app dark>
    <div v-if="connectionStatus !== 'online'" class="connection-container">
      <div class="connection-banner" :class="connectionStatus">
        <v-icon left>
          {{ connectionStatusIcon }}
        </v-icon>
        <span>&nbsp;{{ connectionStatusText }}</span>
      </div>
    </div>
    <v-main>
      <template v-if="!isNotFoundPage">
        <v-app-bar v-if="showMenu && ['DigitalID', 'Releasing', 'History', 'Profile'].includes(currentPage)"
          class="px-4" location="bottom" prominent>

          <div @click="toDigitalID" class="d-flex align-center flex-column" icon>
            <v-icon class="text-grey" :class="{ 'active-icon': currentPage === 'DigitalID' }">
              mdi-qrcode
            </v-icon>
            <span class="nav-text" :class="{ 'active-nav-text': currentPage === 'DigitalID' }">Digital ID</span>
          </div>

          <v-spacer></v-spacer>

          <div @click="toReleasing" class="d-flex align-center flex-column" icon>
            <v-badge :content="this.releasingCashCount" :class="{ 'd-none': this.releasingCashCount < 1 }" color="red"
              size="small" class="ms-8" style="z-index: 999;"></v-badge>
            <v-icon class="text-grey"
              :class="{ 'active-icon': currentPage === 'Releasing' }">mdi-hand-heart-outline</v-icon>
            <span class="nav-text" :class="{ 'active-nav-text': currentPage === 'Releasing' }">Releasing</span>
          </div>

          <v-spacer></v-spacer>

          <div @click="toHistory" class="d-flex align-center flex-column" icon>
            <v-icon class="text-grey" :class="{ 'active-icon': currentPage === 'History' }">mdi-history</v-icon>
            <span class="nav-text" :class="{ 'active-nav-text': currentPage === 'History' }">History</span>
          </div>

          <v-spacer></v-spacer>

          <div @click="toProfile" class="d-flex align-center flex-column" icon>
            <v-icon class="text-grey"
              :class="{ 'active-icon': currentPage === 'Profile' }">mdi-account-circle-outline</v-icon>
            <span class="nav-text" :class="{ 'active-nav-text': currentPage === 'Profile' }">Profile</span>
          </div>

        </v-app-bar>
      </template>
      <v-layout>
        <router-view />
        <GlobalLoader />
        <Alert ref="alertRef" />
      </v-layout>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useRoute } from 'vue-router';
import Alert from '@/components/Alert.vue';
import GlobalLoader from '@/components/GlobalLoader.vue';
import echo from '@/resources/js/echo';

export default {
  name: 'App',

  data() {
    return {
      currentPage: '',
      releasingCashCount: null,
    }
  },

  components: {
    GlobalLoader,
    Alert
  },

  setup() {
    const authStore = useAuthStore();
    const benefeciaryStore = useBenefeciaryStore();
    const loadingStore = useLoadingStore();
    const connectionStatus = ref('online');
    const route = useRoute();
    const isNotFoundPage = computed(() => route.name === 'NotFound');

    const updateStatus = () => {
      if (!navigator.onLine) {
        connectionStatus.value = 'offline';
      } else {
        connectionStatus.value = 'online';
      }
    };

    let waitingTimeout;
    const simulateWaiting = () => {
      connectionStatus.value = 'waiting';
      waitingTimeout = setTimeout(() => {
        connectionStatus.value = navigator.onLine ? 'online' : 'offline';
      }, 3000);
    };

    onMounted(() => {
      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);

      simulateWaiting();

      if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
          if (navigator.connection.downlink < 1) {
            connectionStatus.value = 'slow';
          } else if (navigator.onLine) {
            connectionStatus.value = 'online';
          }
        });
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (waitingTimeout) clearTimeout(waitingTimeout);
    });

    const connectionStatusText = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'No internet connection';
        case 'slow':
          return 'Low internet connection';
        case 'waiting':
          return 'Waiting for connection...';
        default:
          return '';
      }
    });

    const connectionStatusIcon = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'mdi-wifi-off';
        case 'slow':
          return 'mdi-wifi-alert';
        case 'waiting':
          return 'mdi-timer-sand';
        default:
          return '';
      }
    });

    return {
      authStore,
      loadingStore,
      benefeciaryStore,
      drawer: ref(true),
      open: ref(false),
      connectionStatus,
      connectionStatusText,
      connectionStatusIcon,
      isNotFoundPage,
    };
  },

  beforeMount() {
    echo.leave('received-cash-channel');
  },

  mounted() {
    this.currentPage = 'DigitalID';
    this.updateMe();
    this.fetchReleasingCashCount();
  },

  computed: {
    showSidebar() {
      return this.$route.name !== 'LoginPage' && !this.isNotFoundPage;
    },
    showMenu() {
      const allowedPaths = ['/digital-id', '/releasing', '/history', '/profile'];
      return allowedPaths.includes(this.$route.path);
    },
  },

  methods: {
    toDigitalID() {
      this.$router.push('/digital-id');
      this.currentPage = 'DigitalID';
    },

    toReleasing() {
      this.$router.push('/releasing');
      this.currentPage = 'Releasing';
    },

    toHistory() {
      this.$router.push('/history');
      this.currentPage = 'History';
    },

    toProfile() {
      this.$router.push('/profile');
      this.currentPage = 'Profile';
    },

    // Real-time updates for cash arrival
    updateMe() {
      echo.channel('arrived-cash-channel')
        .listen('CashArrived', (e) => {
          console.log(e);
          this.showSuccess('Good news! There will be upcoming AICS: ' + e.typeOfBenefit + ' on ' + e.handOverDate, "success");
          this.fetchReleasingCashCount();
        });
    },

    async fetchReleasingCashCount() {
      try {
        await this.benefeciaryStore.fetchReleasingCashCountStore();
        this.releasingCashCount = this.benefeciaryStore.releasingCashBenefCount;
      } catch (error) {
        console.error(error);
        // this.showAlert(error, "error");
      } finally {
        this.loadingHandOverBenef = false;
      }
    },

    showSuccess(message) {
      this.$refs.alertRef.showSnackbarAlert(message, "success");
    },

    showAlert(message) {
      this.$refs.alertRef.showSnackbarAlert(message, "error");
    },
  }
};
</script>

<style scoped>
.v-badge__badge {
  font-weight: 700 !important;
  padding: 2px 4px !important;
  min-width: 0 !important;
}

.v-icon {
  border-radius: 30px;
  padding: 15px;
  font-size: 20px !important;
}

.active-icon {
  transition: all 0.3s ease;
  border-radius: 30px;
  background-color: #1d59ff !important;
  color: #fff !important;
}

.active-nav-text {
  color: #1d59ff !important;
  font-weight: 600;
}

.nav-text {
  text-transform: none;
  font-size: 10px;
}
</style>