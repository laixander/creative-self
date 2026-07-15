import { defineStore } from 'pinia'
import type { HrOffering } from '~/types/hr/offering'
import type { HrProvider } from '~/types/hr/provider'
import type { HrMediaPost } from '~/types/hr/mediaPost'
import type { HrBooking } from '~/types/hr/booking'
import type { HrAvailedBooking } from '~/types/hr/availedBooking'
import type { HrCompanyProfile } from '~/types/hr/companyProfile'
import { useProviderStore } from './providerStore'

export const useHrStore = defineStore('hrStore', {
    state: () => ({
        offerings: [] as HrOffering[],
        providers: [] as HrProvider[],
        media: [] as HrMediaPost[],
        bookings: [] as HrBooking[],
        availedBookings: [] as HrAvailedBooking[],
        profile: null as HrCompanyProfile | null,
        isLoading: false,
        isDataDeployed: false,
    }),

    actions: {
        async deployMockData() {
            this.isLoading = true
            try {
                const [
                    offeringsData,
                    providersData,
                    mediaData,
                    bookingsData,
                    availedData,
                    profileData
                ] = await Promise.all([
                    $fetch<HrOffering[]>('/api/hr/offerings'),
                    $fetch<HrProvider[]>('/api/hr/providers'),
                    $fetch<HrMediaPost[]>('/api/hr/media'),
                    $fetch<HrBooking[]>('/api/hr/bookings'),
                    $fetch<HrAvailedBooking[]>('/api/hr/availed'),
                    $fetch<HrCompanyProfile>('/api/hr/profile')
                ])

                this.offerings = offeringsData
                this.providers = providersData
                this.media = mediaData
                this.bookings = bookingsData
                this.availedBookings = availedData
                this.profile = profileData
                
                this.isDataDeployed = true
                const toast = useToast()
                toast.add({ title: 'Data Deployed', description: 'HR mock data loaded successfully.', color: 'success' })
            } catch (err) {
                console.error('Failed to deploy HR mock data', err)
                const toast = useToast()
                toast.add({ title: 'Error deploying data', description: String(err), color: 'error' })
            } finally {
                this.isLoading = false
            }
        },

        removeMockData() {
            this.offerings = []
            this.providers = []
            this.media = []
            this.bookings = []
            this.availedBookings = []
            this.profile = null
            this.isDataDeployed = false
        },

        /** 
         * Creates a booking in the HR portal, and syncs it over to the Provider portal 
         * to demonstrate cross-domain demo persistence.
         */
        createBooking(booking: HrBooking) {
            // Add to HR's active bookings
            this.bookings.unshift(booking)

            // Sync to Provider store
            const providerStore = useProviderStore()
            
            // Map HR booking format to Provider booking format
            const mappedProviderBooking = {
                id: booking.id,
                company: this.profile?.companyName || 'Unknown Company',
                offering: booking.offering,
                date: booking.date,
                time: booking.time,
                location: booking.location,
                contactName: booking.contactName || this.profile?.contactName,
                price: booking.price,
                participants: booking.participants,
                status: booking.status
            }
            
            providerStore.bookings.unshift(mappedProviderBooking as any)
        },
        
        /**
         * Cancels an HR booking and syncs status to Provider.
         */
        cancelBooking(id: number) {
            const hrBooking = this.bookings.find(b => b.id === id)
            if (hrBooking) hrBooking.status = 'cancelled'

            const providerStore = useProviderStore()
            const pBooking = providerStore.bookings.find(b => b.id === id)
            if (pBooking) pBooking.status = 'cancelled'
        }
    },
    persist: {
        storage: persistedState.localStorage,
    },
})
