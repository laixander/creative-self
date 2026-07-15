import { defineStore } from 'pinia'
import type { Offering } from '~/types/provider/offering'
import type { Client } from '~/types/provider/client'
import type { ScheduleEvent } from '~/types/provider/scheduleEvent'
import type { MediaPost } from '~/types/provider/mediaPost'
import type { Booking } from '~/types/provider/booking'
import type { AvailedBooking } from '~/types/provider/availedBooking'

export const useProviderStore = defineStore('providerStore', {
    state: () => ({
        offerings: [] as Offering[],
        clients: [] as Client[],
        scheduleEvents: [] as ScheduleEvent[],
        media: [] as MediaPost[],
        bookings: [] as Booking[],
        availedBookings: [] as AvailedBooking[],
        isLoading: false,
        isDataDeployed: false,
    }),

    actions: {
        async deployMockData() {
            this.isLoading = true
            try {
                const [
                    offeringsData,
                    clientsData,
                    scheduleData,
                    mediaData,
                    bookingsData,
                    availedData
                ] = await Promise.all([
                    $fetch<Offering[]>('/api/provider/offerings'),
                    $fetch<Client[]>('/api/provider/clients'),
                    $fetch<ScheduleEvent[]>('/api/provider/schedule'),
                    $fetch<MediaPost[]>('/api/provider/media'),
                    $fetch<Booking[]>('/api/provider/bookings'),
                    $fetch<AvailedBooking[]>('/api/provider/availed')
                ])

                this.offerings = offeringsData
                this.clients = clientsData
                this.scheduleEvents = scheduleData
                this.media = mediaData
                this.bookings = bookingsData
                this.availedBookings = availedData
                
                this.isDataDeployed = true
            } catch (err) {
                console.error('Failed to deploy provider mock data', err)
            } finally {
                this.isLoading = false
            }
        },

        removeMockData() {
            this.offerings = []
            this.clients = []
            this.scheduleEvents = []
            this.media = []
            this.bookings = []
            this.availedBookings = []
            this.isDataDeployed = false
        },

        updateBookingStatus(id: number, status: 'confirmed' | 'completed' | 'cancelled' | 'rejected' | 'pending_confirmation') {
            // Update Provider Booking
            const booking = this.bookings.find(b => b.id === id)
            if (booking) {
                booking.status = status
                
                // If completed, add to availed in Provider
                if (status === 'completed') {
                    const existingAvailed = this.availedBookings.find(a => a.id === id)
                    if (!existingAvailed) {
                        this.availedBookings.unshift({
                            id: booking.id,
                            company: booking.company,
                            offering: booking.offering,
                            date: booking.date,
                            participants: booking.participants,
                            price: booking.price,
                            rating: 0,
                            status: 'completed'
                        })
                    }
                }
            }

            // Sync to HR Store
            // We use dynamic import to avoid circular dependency if hrStore imports providerStore at the top
            import('./hrStore').then(({ useHrStore }) => {
                const hrStore = useHrStore()
                const hrBooking = hrStore.bookings.find(b => b.id === id)
                if (hrBooking) {
                    hrBooking.status = status as any
                    if (status === 'completed') {
                        const existingAvailed = hrStore.availedBookings.find(a => a.id === id)
                        if (!existingAvailed) {
                            hrStore.availedBookings.unshift({
                                id: hrBooking.id,
                                provider: hrBooking.provider,
                                offering: hrBooking.offering,
                                date: hrBooking.date,
                                participants: hrBooking.participants,
                                price: hrBooking.price,
                                rating: 0,
                                status: 'completed'
                            })
                        }
                    }
                }
            })
        }
    },
    persist: {
        storage: persistedState.localStorage,
    },
})
