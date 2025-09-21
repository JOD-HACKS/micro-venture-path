// PWA utilities for offline functionality and service worker management

export interface QueuedApplication {
  id: string;
  projectId: string;
  studentId: string;
  coverLetter?: string;
  timestamp: number;
  status: 'queued' | 'syncing' | 'synced' | 'failed';
}

class PWAManager {
  private dbName = 'prashiskshan-offline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          console.log('New service worker version available');
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Initialize IndexedDB
    await this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;
        
        // Create applications queue store
        if (!db.objectStoreNames.contains('applications-queue')) {
          const store = db.createObjectStore('applications-queue', { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('timestamp', 'timestamp');
        }
      };
    });
  }

  async queueApplication(application: Omit<QueuedApplication, 'id' | 'timestamp' | 'status'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const queuedApp: QueuedApplication = {
      ...application,
      id: `queued_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'queued'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['applications-queue'], 'readwrite');
      const store = transaction.objectStore('applications-queue');
      const request = store.add(queuedApp);

      request.onsuccess = () => resolve(queuedApp.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getQueuedApplications(): Promise<QueuedApplication[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['applications-queue'], 'readonly');
      const store = transaction.objectStore('applications-queue');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateApplicationStatus(id: string, status: QueuedApplication['status']): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['applications-queue'], 'readwrite');
      const store = transaction.objectStore('applications-queue');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const application = getRequest.result;
        if (application) {
          application.status = status;
          const putRequest = store.put(application);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Application not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async removeFromQueue(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['applications-queue'], 'readwrite');
      const store = transaction.objectStore('applications-queue');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async syncQueuedApplications(): Promise<void> {
    const queuedApps = await this.getQueuedApplications();
    const unsynced = queuedApps.filter(app => app.status === 'queued');

    for (const app of unsynced) {
      try {
        await this.updateApplicationStatus(app.id, 'syncing');

        // Attempt to sync with server
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: app.projectId,
            student_id: app.studentId,
            cover_letter: app.coverLetter,
            submitted_via: 'offline',
            is_queued: false
          })
        });

        if (response.ok) {
          await this.updateApplicationStatus(app.id, 'synced');
          // Keep synced applications for a while for user reference
          setTimeout(() => this.removeFromQueue(app.id), 24 * 60 * 60 * 1000); // 24 hours
        } else {
          await this.updateApplicationStatus(app.id, 'failed');
        }
      } catch (error) {
        console.error('Failed to sync application:', app.id, error);
        await this.updateApplicationStatus(app.id, 'failed');
      }
    }
  }

  async requestPersistentStorage(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const persistent = await navigator.storage.persist();
        console.log('Persistent storage:', persistent);
        return persistent;
      } catch (error) {
        console.error('Failed to request persistent storage:', error);
        return false;
      }
    }
    return false;
  }

  async getStorageUsage(): Promise<{ used: number; quota: number } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      } catch (error) {
        console.error('Failed to get storage estimate:', error);
        return null;
      }
    }
    return null;
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  onOnlineStatusChange(callback: (online: boolean) => void): () => void {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

// Export singleton instance
export const pwa = new PWAManager();
