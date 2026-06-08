<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{
  modelValue: string
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const viewDate = ref(new Date())

const year = computed(() => viewDate.value.getFullYear())
const month = computed(() => viewDate.value.getMonth())

const monthName = computed(() =>
  new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(viewDate.value),
)

const daysInMonth = computed(() => new Date(year.value, month.value + 1, 0).getDate())
const firstDayOfWeek = computed(() => new Date(year.value, month.value, 1).getDay())

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const calendarDays = computed(() => {
  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek.value; i++) days.push(null)
  for (let i = 1; i <= daysInMonth.value; i++) days.push(i)
  return days
})

function prevMonth() {
  viewDate.value = new Date(year.value, month.value - 1, 1)
}

function nextMonth() {
  viewDate.value = new Date(year.value, month.value + 1, 1)
}

function selectDate(day: number) {
  const m = String(month.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  emit('update:modelValue', `${year.value}-${m}-${d}`)
  open.value = false
}

function isSelected(day: number) {
  if (!props.modelValue) return false
  const d = new Date(props.modelValue)
  return d.getFullYear() === year.value && d.getMonth() === month.value && d.getDate() === day
}

function isToday(day: number) {
  const today = new Date()
  return today.getFullYear() === year.value && today.getMonth() === month.value && today.getDate() === day
}

function isPast(day: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(year.value, month.value, day)
  return d < today
}

function formatDisplay() {
  if (!props.modelValue) return ''
  const d = new Date(props.modelValue + 'T00:00:00')
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

function toggle() {
  open.value = !open.value
  if (props.modelValue && open.value) {
    viewDate.value = new Date(props.modelValue + 'T00:00:00')
  }
}

function clearDate() {
  emit('update:modelValue', '')
  open.value = false
}
</script>

<template>
  <div class="relative">
    <label class="text-xs font-semibold uppercase text-slate-500">{{ label }}</label>
    <button
      type="button"
      class="mt-1 flex w-full items-center justify-between rounded-xl border py-2.5 px-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
      :class="modelValue ? 'text-slate-900 dark:text-white' : 'text-slate-400'"
      @click="toggle"
    >
      <span>{{ formatDisplay() || 'Pilih tanggal' }}</span>
      <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>

    <Teleport to="body">
      <Transition name="calendar">
        <div
          v-if="open"
          class="fixed inset-0 z-[200]"
          @click="open = false"
        >
          <div
            class="absolute z-[201] mt-1 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            :style="{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }"
            @click.stop
          >
            <div class="flex items-center justify-between mb-4">
              <button
                type="button"
                class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                @click="prevMonth"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <span class="text-sm font-semibold">{{ monthName }}</span>
              <button
                type="button"
                class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                @click="nextMonth"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>

            <div class="grid grid-cols-7 gap-1 text-center mb-2">
              <div
                v-for="d in dayNames"
                :key="d"
                class="text-xs font-semibold text-slate-400 py-1"
              >
                {{ d }}
              </div>
            </div>

            <div class="grid grid-cols-7 gap-1 text-center">
              <div
                v-for="(day, i) in calendarDays"
                :key="i"
              >
                <button
                  v-if="day"
                  type="button"
                  :disabled="isPast(day)"
                  class="h-9 w-9 rounded-lg text-sm transition-all"
                  :class="{
                    'bg-lab-600 text-white shadow-sm': isSelected(day),
                    'hover:bg-slate-100 dark:hover:bg-slate-800': !isSelected(day) && !isPast(day),
                    'text-slate-900 dark:text-white': !isSelected(day) && !isPast(day),
                    'text-slate-300 dark:text-slate-600 cursor-not-allowed': isPast(day),
                    'ring-1 ring-lab-500/30': isToday(day) && !isSelected(day),
                  }"
                  @click="selectDate(day)"
                >
                  {{ day }}
                </button>
              </div>
            </div>

            <div class="flex justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                class="text-xs text-slate-500 hover:text-rose-500 transition-colors"
                @click="clearDate"
              >
                Hapus
              </button>
              <button
                type="button"
                class="text-xs font-medium text-lab-600 hover:text-lab-500 transition-colors"
                @click="open = false"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.calendar-enter-active,
.calendar-leave-active {
  transition: opacity 0.15s;
}
.calendar-enter-from,
.calendar-leave-to {
  opacity: 0;
}
</style>
