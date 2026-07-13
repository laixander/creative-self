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
        }
    },
    persist: {
        storage: persistedState.localStorage,
    },
})
