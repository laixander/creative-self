<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useHrStore } from '~/stores/hrStore'
import type { HrCompanyProfile } from '~/types/hr/companyProfile'

const toast = useToast()
const hrStore = useHrStore()

// ============================================================================
// Schema & State
// ============================================================================
const schema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    industry: z.string().min(1, 'Industry is required'),
    address: z.string().min(1, 'Location is required'),
    contactName: z.string().min(1, 'Contact name is required'),
    contactEmail: z.string().email('Must be a valid email'),
    contactPhone: z.string().min(1, 'Phone number is required'),
    employeeCount: z.number().min(1, 'Employees count is required')
})

type Schema = z.output<typeof schema>

// Initialize state from store
const profile = hrStore.profile
const state = reactive<Schema>({
    companyName: profile?.companyName || '',
    industry: profile?.industry || '',
    address: profile?.address || '',
    contactName: profile?.contactName || '',
    contactEmail: profile?.contactEmail || '',
    contactPhone: profile?.contactPhone || '',
    employeeCount: profile?.employeeCount || 1
})

const formRef = useTemplateRef('formRef')
const isSaving = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (isSaving.value) return
    isSaving.value = true
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800))
    
    // Update store
    if (hrStore.profile) {
        hrStore.profile = {
            ...hrStore.profile,
            ...event.data
        }
    } else {
        hrStore.profile = {
            id: Date.now(),
            joinedDate: new Date().toISOString(),
            logo: logoPreview.value || undefined,
            ...event.data
        } as HrCompanyProfile
    }
    
    isSaving.value = false
    toast.add({ title: 'Profile updated', description: 'Company profile has been saved.', color: 'success' })
}

// ============================================================================
// Logo / Photo
// ============================================================================
const logoPreview = ref<string | null>(profile?.logo ?? null)
const logoFile = ref<File | null>(null)

function handleLogoUpload(file: File | null | undefined) {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
        toast.add({ title: 'File too large', description: 'Please upload an image under 5 MB.', color: 'error' })
        return
    }
    logoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => { 
        const result = e.target?.result as string
        logoPreview.value = result 
        if (hrStore.profile) hrStore.profile.logo = result
    }
    reader.readAsDataURL(file)
}

function removeLogo() {
    logoPreview.value = null
    logoFile.value = null
    if (hrStore.profile) hrStore.profile.logo = undefined
}

// ============================================================================
// Metrics
// ============================================================================
const totalSpend = computed(() => {
    return hrStore.availedBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.price, 0)
})

const totalParticipants = computed(() => {
    return hrStore.availedBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.participants, 0)
})

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start p-4 sm:p-6">

        <!-- ====================================================
                LEFT — Profile form
                ==================================================== -->
        <div class="lg:col-span-2 space-y-6">
            <UCard variant="subtle">
                <template #header>
                    <div class="font-semibold text-highlighted text-sm">Company Profile</div>
                </template>

                <UForm ref="formRef" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UFormField label="Company Name" name="companyName" required>
                            <UInput v-model="state.companyName" variant="outline" class="w-full"
                                placeholder="Your company name" />
                        </UFormField>
                        <UFormField label="Industry" name="industry" required>
                            <UInput v-model="state.industry" variant="outline" class="w-full"
                                placeholder="e.g. Technology" />
                        </UFormField>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UFormField label="Headquarters Location" name="address" required>
                            <UInput v-model="state.address" variant="outline" class="w-full"
                                placeholder="e.g. New York, NY" />
                        </UFormField>
                        <UFormField label="Total Employees" name="employeeCount" required>
                            <UInputNumber v-model="state.employeeCount" variant="outline" class="w-full" :min="1" />
                        </UFormField>
                    </div>

                    <UFormField label="Contact Name" name="contactName" required>
                        <UInput v-model="state.contactName" variant="outline" class="w-full"
                            placeholder="John Doe" />
                    </UFormField>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UFormField label="Contact Email" name="contactEmail" required>
                            <UInput v-model="state.contactEmail" variant="outline" class="w-full" type="email"
                                placeholder="hr@yourcompany.com" />
                        </UFormField>
                        <UFormField label="Contact Phone" name="contactPhone" required>
                            <UInput v-model="state.contactPhone" variant="outline" class="w-full"
                                placeholder="+1 555 0100" />
                        </UFormField>
                    </div>
                </UForm>

                <template #footer>
                    <UButton color="primary" :loading="isSaving" icon="i-lucide-save" @click="formRef?.submit()">
                        Save Changes
                    </UButton>
                </template>
            </UCard>
        </div>

        <!-- ====================================================
                RIGHT — Logo, Metrics
                ==================================================== -->
        <div class="space-y-6">

            <!-- Logo -->
            <UCard variant="subtle">
                <template #header>
                    <div class="font-semibold text-highlighted text-sm">Company Logo / Photo</div>
                </template>

                <UFileUpload accept="image/*" class="w-full" :model-value="logoFile"
                    :ui="{ base: logoPreview ? 'hidden' : 'min-h-[160px]' }" @update:model-value="handleLogoUpload">
                    <template #default="{ open }">
                        <!-- Preview -->
                        <div v-if="logoPreview"
                            class="relative rounded-xl overflow-hidden h-44 w-full ring-1 ring-default">
                            <img :src="logoPreview" alt="Company logo" class="w-full h-full object-cover" />
                            <div
                                class="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-2 gap-2">
                                <UButton size="xs" icon="i-lucide-pencil" label="Change" variant="solid" color="neutral"
                                    class="bg-black/60 text-white hover:bg-black/80" @click.stop="open()" />
                                <UButton size="xs" icon="i-lucide-trash-2" variant="solid" color="neutral"
                                    class="bg-black/60 text-white hover:bg-black/80" @click.stop="removeLogo()" />
                            </div>
                        </div>
                        <!-- Drop zone -->
                        <div v-else
                            class="flex flex-col items-center justify-center gap-2 w-full h-44 rounded-xl border-2 border-dashed border-default cursor-pointer hover:bg-elevated/50 transition-colors"
                            @click="open()">
                            <UIcon name="i-lucide-image-plus" class="size-8 text-muted" />
                            <span class="text-xs text-muted">Click to upload company logo</span>
                            <span class="text-xs text-dimmed">PNG, JPG, WEBP up to 5 MB</span>
                        </div>
                    </template>
                </UFileUpload>
            </UCard>

            <!-- Metrics -->
            <UCard variant="subtle">
                <template #header>
                    <div class="font-semibold text-highlighted text-sm">Company Wellness Metrics</div>
                    <p class="text-xs text-muted mt-0.5">Overview of your wellness investments.</p>
                </template>

                <div class="space-y-4">
                    <div class="flex items-center gap-4 border-b border-default pb-4">
                        <div class="p-3 rounded-xl bg-teal-500/10 text-teal-500">
                            <UIcon name="i-lucide-banknote" class="size-6" />
                        </div>
                        <div>
                            <div class="text-sm text-muted">Total Invested</div>
                            <div class="text-xl font-bold text-highlighted">{{ formatter.format(totalSpend) }}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <div class="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                            <UIcon name="i-lucide-users" class="size-6" />
                        </div>
                        <div>
                            <div class="text-sm text-muted">Employees Reached</div>
                            <div class="text-xl font-bold text-highlighted">{{ totalParticipants }}</div>
                        </div>
                    </div>
                </div>
            </UCard>
        </div>

    </div>
</template>
