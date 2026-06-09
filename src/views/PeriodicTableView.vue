<script setup lang="ts">
import { ref, computed } from 'vue'
import ElementCard from '@/components/periodic-table/ElementCard.vue'
import ElementDetail from '@/components/periodic-table/ElementDetail.vue'
import { useElementFilter } from '@/composables/useElementFilter'
import { elements as elementsData } from '@/data/elements'
import type { Element as ChemElement, ElementCategory, ElementState } from '@/types/element'

const {
  searchQuery,
  selectedCategory,
  selectedState,
  selectedElement,
  filteredElements,
  selectElement,
  clearFilters,
  setCategory,
  setState,
} = useElementFilter()

const detailOpen = ref(false)

const elementsByPosition = computed(() => {
  const map = new Map<string, ChemElement>()
  elementsData.forEach(el => {
    map.set(`${el.row}-${el.column}`, el)
  })
  return map
})

const maxRow = computed(() => Math.max(...elementsData.map(e => e.row)))
const maxCol = computed(() => Math.max(...elementsData.map(e => e.column)))

const categories: Array<{ key: ElementCategory; label: string }> = [
  { key: 'alkali-metal', label: 'Alkali Metal' },
  { key: 'alkaline-earth', label: 'Alkaline Earth' },
  { key: 'transition-metal', label: 'Transition Metal' },
  { key: 'lanthanide', label: 'Lanthanide' },
  { key: 'actinide', label: 'Actinide' },
  { key: 'semimetal', label: 'Semimetal' },
  { key: 'nonmetal', label: 'Nonmetal' },
  { key: 'halogen', label: 'Halogen' },
  { key: 'noble-gas', label: 'Noble Gas' },
  { key: 'other-metal', label: 'Other Metal' },
]

const states: Array<{ key: ElementState; label: string }> = [
  { key: 'solid', label: 'Solid' },
  { key: 'liquid', label: 'Liquid' },
  { key: 'gas', label: 'Gas' },
  { key: 'synthetic', label: 'Synthetic' },
]

const handleElementClick = (element: ChemElement) => {
  selectElement(element)
  detailOpen.value = true
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'alkali-metal': 'bg-yellow-100 dark:bg-yellow-900/60',
    'alkaline-earth': 'bg-green-100 dark:bg-green-900/60',
    'transition-metal': 'bg-blue-100 dark:bg-blue-900/60',
    'lanthanide': 'bg-cyan-100 dark:bg-cyan-900/60',
    'actinide': 'bg-violet-100 dark:bg-violet-900/60',
    'semimetal': 'bg-amber-100 dark:bg-amber-900/60',
    'nonmetal': 'bg-orange-100 dark:bg-orange-900/60',
    'halogen': 'bg-teal-100 dark:bg-teal-900/60',
    'noble-gas': 'bg-pink-100 dark:bg-pink-900/60',
    'other-metal': 'bg-slate-100 dark:bg-slate-800/60',
  }
  return colors[category] || colors['other-metal']
}
</script>

<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="font-display text-2xl font-bold text-slate-900 dark:text-white lg:text-3xl">
        Periodic Table
      </h1>
      <p class="mt-1 text-slate-500">Interactive periodic table of chemical elements</p>
    </div>

    <div class="glass rounded-xl p-4 md:p-6 mb-8 space-y-4">
      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search element (name, symbol, number)..."
          class="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lab-500/40"
        />
        <button
          v-if="searchQuery || selectedCategory || selectedState"
          @click="clearFilters"
          class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
        >Clear</button>
      </div>

      <div>
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</p>
        <div class="flex flex-wrap gap-2">
          <button
            @click="setCategory(null)"
            :class="selectedCategory === null ? 'bg-lab-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >All</button>
          <button
            v-for="cat in categories"
            :key="cat.key"
            @click="setCategory(cat.key)"
            :class="selectedCategory === cat.key ? 'bg-lab-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >{{ cat.label }}</button>
        </div>
      </div>

      <div>
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Physical State</p>
        <div class="flex flex-wrap gap-2">
          <button
            @click="setState(null)"
            :class="selectedState === null ? 'bg-lab-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >All</button>
          <button
            v-for="state in states"
            :key="state.key"
            @click="setState(state.key)"
            :class="selectedState === state.key ? 'bg-lab-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >{{ state.label }}</button>
        </div>
      </div>

      <div class="text-sm text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
        Showing {{ filteredElements.length }} of {{ elementsData.length }} elements
      </div>
    </div>

    <div
      class="gap-1 md:gap-1.5 mb-8 overflow-x-auto overflow-y-visible pb-4 -mx-3 sm:-mx-4 lg:-mx-8 px-3 sm:px-4 lg:px-8"
      :style="{
        display: 'grid',
        gridTemplateColumns: `repeat(18, minmax(52px, 1fr))`,
        gridAutoRows: 'minmax(72px, auto)',
      }"
    >
      <template v-for="row in maxRow" :key="`row-${row}`">
        <template v-for="col in maxCol" :key="`cell-${row}-${col}`">
          <div :style="{ gridColumn: col, gridRow: row }">
            <ElementCard
              v-if="elementsByPosition.has(`${row}-${col}`) && filteredElements.includes(elementsByPosition.get(`${row}-${col}`)!)"
              :element="elementsByPosition.get(`${row}-${col}`)!"
              @click="handleElementClick"
            />
          </div>
        </template>
      </template>
    </div>

    <div class="glass rounded-xl p-6">
      <h2 class="font-display font-semibold text-lg text-slate-900 dark:text-white mb-4">Legend</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="cat in categories" :key="cat.key" class="flex items-center gap-2">
          <div class="w-5 h-5 rounded" :class="getCategoryColor(cat.key)"></div>
          <span class="text-sm text-slate-700 dark:text-slate-300">{{ cat.label }}</span>
        </div>
      </div>
    </div>

    <ElementDetail
      :element="selectedElement"
      :is-open="detailOpen"
      @close="detailOpen = false"
    />
  </div>
</template>
