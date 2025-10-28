// Cross-device localStorage synchronization manager
class SyncManager {
  constructor() {
    this.syncEndpoint = '/api/sync'
    this.pollInterval = 2000 // Poll every 2 seconds
    this.isPolling = false
    this.lastSync = {}
  }

  // Start polling for changes from other devices
  startSync() {
    if (this.isPolling) return
    
    this.isPolling = true
    this.pollForChanges()
  }

  // Stop polling
  stopSync() {
    this.isPolling = false
    if (this.pollTimer) {
      clearTimeout(this.pollTimer)
    }
  }

  // Poll server for data changes
  async pollForChanges() {
    if (!this.isPolling) return

    try {
      // Check for purposes changes
      await this.checkForUpdates('ncip_purposes')
      await this.checkForUpdates('ncip_services')
      await this.checkForUpdates('applications')
      await this.checkForUpdates('users')
      await this.checkForUpdates('pendingRegistrations')
    } catch (error) {
      console.log('Sync check failed:', error.message)
    }

    // Schedule next poll
    this.pollTimer = setTimeout(() => {
      this.pollForChanges()
    }, this.pollInterval)
  }

  // Check for updates to specific data key
  async checkForUpdates(key) {
    try {
      const response = await fetch(`${this.syncEndpoint}/${key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const serverData = await response.json()
        const localData = JSON.parse(localStorage.getItem(key) || '[]')
        
        // Compare data timestamps or content
        if (JSON.stringify(serverData.data) !== JSON.stringify(localData)) {
          // Update local storage
          localStorage.setItem(key, JSON.stringify(serverData.data))
          
          // Trigger update events
          this.triggerUpdateEvent(key, serverData.data)
        }
      }
    } catch (error) {
      // Server might not have sync endpoint, use fallback
      console.log(`Sync endpoint not available for ${key}`)
    }
  }

  // Send data to server for other devices
  async syncToServer(key, data) {
    try {
      const response = await fetch(`${this.syncEndpoint}/${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: data,
          timestamp: Date.now()
        })
      })

      if (!response.ok) {
        console.log('Sync to server failed, using localStorage only')
      }
    } catch (error) {
      console.log('Sync endpoint not available, using localStorage only')
    }
  }

  // Trigger appropriate update events
  triggerUpdateEvent(key, data) {
    switch (key) {
      case 'ncip_purposes':
        window.dispatchEvent(new CustomEvent('purposesChanged', { 
          detail: { count: data.length, data: data, source: 'sync' }
        }))
        break
      case 'ncip_services':
        window.dispatchEvent(new CustomEvent('servicesChanged', { 
          detail: { count: data.length, data: data, source: 'sync' }
        }))
        break
      case 'applications':
        window.dispatchEvent(new CustomEvent('applicationsChanged', { 
          detail: { count: data.length, data: data, source: 'sync' }
        }))
        break
      case 'users':
        window.dispatchEvent(new CustomEvent('usersChanged', { 
          detail: { count: data.length, data: data, source: 'sync' }
        }))
        break
      default:
        window.dispatchEvent(new CustomEvent('dataChanged', { 
          detail: { key, data, source: 'sync' }
        }))
    }
  }

  // Enhanced localStorage setItem with sync
  setItem(key, value) {
    localStorage.setItem(key, value)
    const data = JSON.parse(value)
    
    // Sync to server for other devices
    this.syncToServer(key, data)
    
    // Trigger local event
    this.triggerUpdateEvent(key, data)
  }

  // Get item from localStorage
  getItem(key) {
    return localStorage.getItem(key)
  }
}

// Create singleton instance
const syncManager = new SyncManager()

// Auto-start sync when module loads
syncManager.startSync()

export default syncManager
