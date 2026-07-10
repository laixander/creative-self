<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

// ============================================================================
// Schema & State
// ============================================================================
const schema = z.object({
    name: z.string().min(1, 'Provider name is required'),
    description: z.string().min(1, 'Description is required'),
    coverageArea: z.string().min(1, 'Coverage area is required'),
    contactEmail: z.string().email('Must be a valid email'),
    contactPhone: z.string().min(1, 'Phone number is required'),
    website: z.string().url('Must be a valid URL').or(z.literal('')).optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
    name: 'Stillwater Mindfulness',
    description: 'Meditation, breathwork, and stress resilience programs for modern teams.',
    coverageArea: 'Global · Online',
    contactEmail: 'hello@provider.co',
    contactPhone: '+1 555 0100',
    website: 'https://stillwatermindfulness.com'
})

const formRef = useTemplateRef('formRef')
const isSaving = ref(false)

async function onSubmit(_event: FormSubmitEvent<Schema>) {
    if (isSaving.value) return
    isSaving.value = true
    await new Promise(r => setTimeout(r, 800))
    isSaving.value = false
    toast.add({ title: 'Profile updated', description: 'Your changes have been saved.', color: 'success' })
}

// ============================================================================
// Cover photo
// ============================================================================
const coverPreview = ref<string | null>('/img/stockphoto_5.jpg')
const coverFile = ref<File | null>(null)

function handleCoverUpload(file: File | null | undefined) {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
        toast.add({ title: 'File too large', description: 'Please upload an image under 5 MB.', color: 'error' })
        return
    }
    coverFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => { coverPreview.value = e.target?.result as string }
    reader.readAsDataURL(file)
}

function removeCover() {
    coverPreview.value = null
    coverFile.value = null
}

// ============================================================================
// Rating & specialisations
// ============================================================================
const rating = ref(4.9)

const allSpecialisations = [
    'Meditation', 'Stress Management', 'Fitness', 'Nutrition',
    'Breathwork', 'Yoga', 'Sleep', 'Resilience', 'Mindfulness'
]

const selectedSpecialisations = ref<string[]>(['Meditation', 'Stress Management'])

function toggleSpec(spec: string) {
    const idx = selectedSpecialisations.value.indexOf(spec)
    if (idx === -1) selectedSpecialisations.value.push(spec)
    else selectedSpecialisations.value.splice(idx, 1)
}

// ============================================================================
// Credentials
// ============================================================================
interface Credential {
    id: number
    name: string
    fileName?: string
    uploaded: boolean
}

const credentials = ref<Credential[]>([
    { id: 1, name: 'Business registration', uploaded: true, fileName: 'business_reg.pdf' },
    { id: 2, name: 'Insurance certificate', uploaded: true, fileName: 'insurance_cert.pdf' },
    { id: 3, name: 'Practitioner licenses', uploaded: false }
])

const uploadingId = ref<number | null>(null)

function handleDocUpload(credential: Credential, file: File | null | undefined) {
    if (!file) return
    uploadingId.value = credential.id
    setTimeout(() => {
        credential.uploaded = true
        credential.fileName = file.name
        uploadingId.value = null
        toast.add({ title: 'Document uploaded', description: `"${file.name}" was attached to ${credential.name}.`, color: 'success' })
    }, 900)
}

function removeDoc(credential: Credential) {
    credential.uploaded = false
    credential.fileName = undefined
    toast.add({ title: 'Document removed', description: credential.name, color: 'neutral' })
}
</script>

<template>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <!-- ====================================================
                LEFT — Profile form
                ==================================================== -->
        <div class="lg:col-span-2 space-y-6">
            <UCard variant="subtle">
                <template #header>
                    <div class="font-semibold text-highlighted text-sm">Basic Information</div>
                </template>

                <UForm ref="formRef" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormField label="Provider name" name="name" required>
                        <UInput v-model="state.name" variant="outline" class="w-full"
                            placeholder="Your business or practice name" />
                    </UFormField>

                    <UFormField label="Description" name="description" required>
                        <UTextarea v-model="state.description" variant="outline" class="w-full" :rows="4"
                            placeholder="Briefly describe your services and mission..." />
                    </UFormField>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UFormField label="Coverage area" name="coverageArea" required>
                            <UInput v-model="state.coverageArea" variant="outline" class="w-full"
                                placeholder="e.g. Global · Online" />
                        </UFormField>
                        <UFormField label="Contact email" name="contactEmail" required>
                            <UInput v-model="state.contactEmail" variant="outline" class="w-full" type="email"
                                placeholder="hello@yourdomain.com" />
                        </UFormField>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UFormField label="Contact phone" name="contactPhone" required>
                            <UInput v-model="state.contactPhone" variant="outline" class="w-full"
                                placeholder="+1 555 0100" />
                        </UFormField>
                        <UFormField label="Website" name="website" hint="Optional">
                            <UInput v-model="state.website" variant="outline" class="w-full"
                                placeholder="https://yourwebsite.com" />
                        </UFormField>
                    </div>
                </UForm>

                <template #footer>
                    <UButton color="primary" :loading="isSaving" icon="i-lucide-save" @click="formRef?.submit()">
                        Save changes
                    </UButton>
                </template>
            </UCard>

            <!-- Specialisations -->
            <UCard variant="subtle">
                <template #header>
                    <div class="font-semibold text-highlighted text-sm">Specialisations</div>
                    <p class="text-xs text-muted mt-0.5">Select the areas you specialise in.</p>
                </template>

                <div class="flex flex-wrap gap-2">
                    <UBadge v-for="spec in allSpecialisations" :key="spec"
                        :color="selectedSpecialisations.includes(spec) ? 'primary' : 'neutral'"
                        :variant="selectedSpecialisations.includes(spec) ? 'subtle' : 'outline'" size="md"
                        class="cursor-pointer select-none transition-all" @click="toggleSpec(spec)">
                        <template v-if="selectedSpecialisations.includes(spec)" #leading>
                            <UIcon name="i-lucide-check" class="size-3" />
                        </template>
                        {{ spec }}
                    </UBadge>
                </div>
            </UCard>
        </div>

        <!-- ====================================================
                RIGHT — Cover photo, Rating, Credentials
                ==================================================== -->
        <div class="space-y-6">

            <!-- Cover photo -->
            <UCard variant="subtle">
                <template #header>
                    <div class="font-semibold text-highlighted text-sm">Cover Photo</div>
                </template>

                <UFileUpload accept="image/*" class="w-full" :model-value="coverFile"
                    :ui="{ base: coverPreview ? 'hidden' : 'min-h-[160px]' }" @update:model-value="handleCoverUpload">
                    <template #default="{ open }">
                        <!-- Preview -->
                        <div v-if="coverPreview"
                            class="relative rounded-xl overflow-hidden h-44 w-full ring-1 ring-default">
                            <img :src="coverPreview" alt="Cover photo" class="w-full h-full object-cover" />
                            <div
                                class="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-2 gap-2">
                                <UButton size="xs" icon="i-lucide-pencil" label="Change" variant="solid" color="neutral"
                                    class="bg-black/60 text-white hover:bg-black/80" @click.stop="open()" />
                                <UButton size="xs" icon="i-lucide-trash-2" variant="solid" color="neutral"
                                    class="bg-black/60 text-white hover:bg-black/80" @click.stop="removeCover()" />
                            </div>
                        </div>
                        <!-- Drop zone -->
                        <div v-else
                            class="flex flex-col items-center justify-center gap-2 w-full h-44 rounded-xl border-2 border-dashed border-default cursor-pointer hover:bg-elevated/50 transition-colors"
                            @click="open()">
                            <UIcon name="i-lucide-image-plus" class="size-8 text-muted" />
                            <span class="text-xs text-muted">Click to upload cover photo</span>
                            <span class="text-xs text-dimmed">PNG, JPG, WEBP up to 5 MB</span>
                        </div>
                    </template>
                </UFileUpload>

                <!-- Rating & tags below image -->
                <div class="mt-4 space-y-3">
                    <div>
                        <p class="text-xs text-muted mb-1">Rating</p>
                        <div class="flex items-center gap-1.5">
                            <UIcon name="i-lucide-star" class="text-amber-400 size-4 fill-amber-400" />
                            <span class="text-xl font-bold text-highlighted">{{ rating.toFixed(1) }}</span>
                            <span class="text-xs text-muted">/ 5.0</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                        <UBadge v-for="spec in selectedSpecialisations" :key="spec" color="primary" variant="subtle"
                            size="sm">
                            {{ spec }}
                        </UBadge>
                        <span v-if="selectedSpecialisations.length === 0" class="text-xs text-muted italic">
                            No specialisations selected
                        </span>
                    </div>
                </div>
            </UCard>

            <!-- Credentials -->
            <UCard variant="subtle">
                <template #header>
                    <div class="font-semibold text-highlighted text-sm">Credentials</div>
                    <p class="text-xs text-muted mt-0.5">Upload your verification documents.</p>
                </template>

                <div class="space-y-2">
                    <div v-for="cred in credentials" :key="cred.id"
                        class="flex items-center justify-between gap-2 py-2 border-b border-default last:border-0">
                        <div class="flex items-center gap-2 min-w-0">
                            <UIcon :name="cred.uploaded ? 'i-lucide-file-check-2' : 'i-lucide-file-x-2'"
                                :class="cred.uploaded ? 'text-success' : 'text-muted'" class="size-4 shrink-0" />
                            <div class="min-w-0">
                                <div class="text-sm text-highlighted truncate">{{ cred.name }}</div>
                                <div v-if="cred.fileName" class="text-xs text-muted truncate">
                                    {{ cred.fileName }}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 shrink-0">
                            <UFileUpload v-if="!cred.uploaded" accept=".pdf,.jpg,.png" class="hidden"
                                @update:model-value="(f) => handleDocUpload(cred, f)">
                                <template #default="{ open }">
                                    <UButton size="xs" variant="outline" color="neutral" icon="i-lucide-upload"
                                        :loading="uploadingId === cred.id" @click="open()">
                                        Upload
                                    </UButton>
                                </template>
                            </UFileUpload>
                            <UButton v-else size="xs" variant="ghost" color="error" icon="i-lucide-x"
                                @click="removeDoc(cred)" />
                        </div>
                    </div>
                </div>

                <template #footer>
                    <UFileUpload accept=".pdf,.jpg,.png" @update:model-value="(f) => {
                        if (f) toast.add({ title: 'Document uploaded', description: f.name, color: 'success' })
                    }">
                        <template #default="{ open }">
                            <UButton icon="i-lucide-upload" color="neutral" variant="outline" size="sm"
                                label="Upload document" @click="open()" />
                        </template>
                    </UFileUpload>
                </template>
            </UCard>
        </div>

    </div>
</template>
