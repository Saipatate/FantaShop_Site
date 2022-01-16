self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('push', (event) => {
    const data = event.data.json()
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: 'https://fantashop.fr/images/logo.png'
    })

})