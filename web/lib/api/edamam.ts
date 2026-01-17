const EDAMAM_FOOD_APP_ID = process.env.NEXT_PUBLIC_EDAMAM_FOOD_APP_ID
const EDAMAM_FOOD_APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_FOOD_APP_KEY

const BASE_URL = 'https://api.edamam.com/api'

export const edamam = {
    food: {
        search: async (query: string) => {
            if (!EDAMAM_FOOD_APP_ID || !EDAMAM_FOOD_APP_KEY) {
                console.warn('Missing Edamam Food API keys')
                return []
            }

            const response = await fetch(`${BASE_URL}/food-database/v2/parser?app_id=${EDAMAM_FOOD_APP_ID}&app_key=${EDAMAM_FOOD_APP_KEY}&ingr=${encodeURIComponent(query)}`)
            if (!response.ok) throw new Error('Edamam API/Food Failed')

            const data = await response.json()
            return data.hints.map((hint: any) => ({
                label: hint.food.label,
                calories: hint.food.nutrients.ENERC_KCAL,
                protein: hint.food.nutrients.PROCNT,
                carbs: hint.food.nutrients.CHOCDF,
                fats: hint.food.nutrients.FAT,
                image: hint.food.image
            }))
        }
    },
    nutrition: {
        analyze: async (ingr: string[]) => {
            if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) return null

            const response = await fetch(`${BASE_URL}/nutrition-details?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingr })
            })

            if (!response.ok) throw new Error('Edamam API/Nutrition Failed')
            return await response.json()
        }
    }
}
